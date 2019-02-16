let currentLocale = 'Phoenix';
const express = require('express');
const bodyParser = require('body-parser');
const playerController = require('./controllers/playersController');
const somewhere = require('./controllers/time');
const axios = require('axios');
require('dotenv').config();
const PORT = process.env.SERVER_PORT || 4000;
const app = express();
app.use(bodyParser.json());

const finalChallenge = whatsMyIp;
const requireName = (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        res.status(404).json({ message: "I can't give you points if you don't have a name!" })
        return;
    }
    if (playerController.addPlayer(name)) {
        console.log(`${name} is ready to start!`);
    };
    app.set('name', name);
    playerController.addPlayer(name);
    next();
}

const answerToTheUltimateQuestion = (req, res, next) => {
    const answer = req.body.answer;
    if (!answer) {
        return nope(res, 'Please tell me the answer');
    }
    if (! Number.isInteger(answer)) {
        return nope(res, 'Please tell me the answer');
    }
    switch (answer) {
        case 42:
            playerController.updateScore(app.get('name'), 1);
            next();
            return;
        default:
            return nope(res, 'Are you just guessing what the answer is?');        
    }
}

const isItHotInHere = (req, res, next) => {
    const { temperature } = req.body;
    const f = ((9/5) * parseInt(temperature) + 32).toPrecision(3);

    if (parseFloat(f) !== 98.6) {
        nope(res, 'The human body can only be so hot');
    } else {
        playerController.updateScore(app.get('name'), 5);
        next();
    }
}

const almostThere = (req, res, next) => {
    if (req.query.mentor === '\u{48}\u{75}\u{6e}\u{74}\u{65}\u{72}') {
        playerController.updateScore(req.app.get('name'), 6)
        next()
    } else {
        nope(res, 'Check the other endpoints for this one (GET)');
        return;
    }
}
app.post('/challenge', 
    requireName, 
    answerToTheUltimateQuestion, 
    somewhere.someTime, 
    whereAmI, 
    (req, res, next) => {
        if (req.body.samwise === require('./data/secrets.json')[2].bestCharacter) {
            playerController.updateScore(app.get('name'), 4);
            next()
        } else {
            nope(res, 'The best character in Lord of the Rings');
        }
    },
    isItHotInHere,
    almostThere,
    playerController.gateLock,
    finalChallenge
)
app.patch('/challenge/:name', playerController.breakTheGates);
app.get('/challenge', riddleMeThis);
app.listen(PORT, console.log('Let the challenge... BEGIN! 🚀', PORT));

function riddleMeThis (req, res){
    res.status(200).json({
        message: 'The answer you seek is 3rd on the list.  The key you need is "mentor"',
        list: ['Josh', 'Travis', 'Mike', 'Hunter', 'Sean'],
        hint: {
            index: 0
        }
    })
}
function nope(res, message) {
    res.status(301).json({message});
    return;
}

app.get('/userdata', playerController.getPlayerData);

function whatsMyIp(req, res, next){
    const { myIp } = req.body;
    if (myIp && myIp === req.ip.slice(req.ip.indexOf('192'))){
        playerController.updateScore(req.app.get('name'), 8);
        blackDiamond(req,res);
        return;
    } else {
        res.status(401).json({ message: 'https://www.whatismybrowser.com/detect/what-is-my-local-ip-address'});
        return;
    }
}

function blackDiamond(req, res) {

    axios.get(`http://${req.body.myIp}:3001`).then(response => {
        const complete = response.data ? response.data.victory ? response.data.victory : false : false;
        if (complete) {
            res.status(200).json({message: 'YOU HAVE DONE IT! SUCCESS!'});
            console.log(asciiVictory(app.get('name'), complete));
        }
    }).catch(err => {
        res.status(501).json({ message: "I tried to call you but you didn't answer" });
    })
}


function asciiVictory(name, message) {
    const padded = (words='') => {
        let rtn = words;
        while (rtn.length < 48) {
            rtn = ' ' + rtn + ' ';
        }

        return '*' + rtn + '*';
    }
    let rtn = '\n';
    for (let i = 0; i < 5; i++) {
        switch(i){
            case 0:
            case 4:
                for (let k = 0; k < 50; k++) {
                    rtn +='*';
                }
                break;
            case 1:
                rtn += padded('!~WINNER~!');
                break;
            case 2:
                rtn += padded(name);
                break;
            case 3:
                rtn += padded(message);
                break;
            default:
                break;
        }

        rtn += '\n';
    }
    rtn +='\n';
    return rtn;
}
function whereAmI(req, res, next) {
    const { location } = req.body;
    if ( location !== currentLocale ) {
        nope(res, 'Try looking around for the answers');
        return;
    }
    playerController.updateScore(app.get('name'), 3);
    next();
}