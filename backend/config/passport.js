const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const path = require('path');
const fs = require('fs');
const userSchema = require('../models/user.model');

const pathToKey = path.join(__dirname, '..', '/id_rsa_pub_pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf-8');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algoriths: ['RS256']
}

const strategy = new JwtStrategy(options, (payload, done) => {
    userSchema.findOne({_id: payload.sub})
        .then((user) => {
            if(user) return done(null, user);
            else return done(null, false);
        })
        .catch((err) => done(err, null));
});

module.exports = (passport) => {passport.use(strategy)};