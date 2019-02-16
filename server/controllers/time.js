const moment = require('moment');
/*
    Check out this awesome library:
    momentjs: https://momentjs.com/
*/ 
const { updateScore } = require('./playersController');

module.exports = {
    someTime: (req, res, next) => {
        const { today } = req.body;
    
        let check = today === moment().format('MMMM Do YYYY');

        if (check) {
            updateScore(req.app.get('name'), 2);
            next()
        } else {
            res.status(301).json({ message: 'Pardon me, do you have the time?'});
        }
    } 
}