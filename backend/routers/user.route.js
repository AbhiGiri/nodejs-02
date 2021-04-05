const router = require('express').Router();
const utils = require('../libs/utils');
const userSchema = require('../models/user.model');
const passport = require('passport');

router.post('/register', (req, res, next) => {
    const saltHash = utils.genPassword(req.body.password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    
    const newUser = new userSchema({
        userName: req.body.userName,
        email: req.body.email,
        salt,
        hash
    });

    newUser.save()
        .then((user) => {
            const jwt = utils.issueJWT(user);
            res.status(200).json({success: true, result: user, token: jwt.token, expiresIn: jwt.expiresIn})
        })
        .catch((err) => {
            res.status(501).json({success: false, error: err})
        })

});

router.post('/login', (req, res, next) => {
    userSchema.findOne({userName: req.body.userName})
        .then((user) => {
            if(!user) { 
                res.status(401).json({success: false, message: 'could not find the user'})
            };
            const isValid = utils.verifyPassword(req.body.password, user.salt, user.hash);
            if(isValid) {
                const jwt = utils.issueJWT(user);
                res.status(200).json({success: true, result: user, token: jwt.token, expiresIn: jwt.expiresIn})
            } else {
                res.status(401).json({success: false, message: 'incorrect userName or password'});
            }
        })
});

router.get('/protected', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.status(200).json({success: true, message: 'you are authorized...'});
});

module.exports = router;