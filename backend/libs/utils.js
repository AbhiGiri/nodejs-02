const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const pathToKey = path.join(__dirname, '..', '/id_rsa_priv_pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf-8');

function genPassword(password) {
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return { salt, hash };
}

function issueJWT(user) {
    const _id = user._id;
    const expiresIn = '1d';
    const payload = {sub: _id, iat: Date.now()};
    const registraionToken = jwt.sign(payload, PRIV_KEY, {expiresIn, algorithm: 'RS256'});
    return {
        token: 'Bearer ' + registraionToken,
        expiresIn
    }
}

function verifyPassword(password, salt, hash) {
    const saltHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === saltHash;
}

module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;
module.exports.verifyPassword = verifyPassword;