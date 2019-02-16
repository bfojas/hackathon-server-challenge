const players = []

module.exports = {
    addPlayer: (name) => {
        if (players.find(e=> e.name ===name)) {
            return false;
        }
        players.push({
            name,
            gate: false,
            currentChallenge: 0
        })
        return true;
    },
    gateLock: (req, res, next) => {
        let player = players.find(e=> e.name === req.app.get('name'))
        if (player.gate) {
            updateScore(player.name, 7)
            next();
        } else {
            res.status(401).json({message:'Blocked at the gates.  Maybe you can break them?'});
        }
    },
    breakTheGates,
    updateScore,
    getPlayerData: (req, res) => {
        return res.status(200).json(players);
    }
}

function updateScore (name, challenge) {
    let player = players.find(e=> e.name === name)
    if (player.currentChallenge < challenge) {
        player.currentChallenge = challenge;
        console.log(`${player.name} has completed challenge ${player.currentChallenge}`);
    }
}

function breakTheGates (req, res) {
    const { name } = req.params;
    if (!name) {
        return res.status(404).json({ message: 'Be sure to give me a name so I can grant you access'});
    }
    if (!players.find(e => e.name.toLowerCase() === name.toLowerCase())) {
        return res.status(301).json({message: 'I am not able to find you... Did you give me the right name?'})
    }
    (players.find(e=>e.name === name)).gate = true;
    updateScore(name);
    return res.status(200).json({ message: 'The Gates are unlocked.  Please proceed.'});
}