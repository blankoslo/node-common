var https = require('https');
// TODO: Remove whenever node gets native es6 promises.
var Promise = require('promise/lib/es6-extensions');

var jwt = require('jsonwebtoken');
var API_TOKEN_SECRET = process.env.API_TOKEN_SECRET || "dev-secret-shhh";

function signAPIAccessToken(payload, expiresIn = '7d') {
    return jwt.sign(payload, API_TOKEN_SECRET, {
        // TODO: No refresh logic yet, so we simply let tokens
        // live for a week. Not optimal!
        expiresIn
    });
}

function verifyAPIAccessToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, API_TOKEN_SECRET, (err, data) => {
            if (err) return reject(err);

            return resolve(data);
        });
    });
}

function middleware(req, res, next) {
    verifyAPIAccessToken(req.headers.authorization)
        .then(
            (data) => {
                req.tokenData = data;
                next();
            },
            (err) => res.status(401).json(err)
        );
}

module.exports = {signAPIAccessToken, verifyAPIAccessToken, middleware};
