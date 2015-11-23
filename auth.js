var https = require('https');

// TODO: Remove whenever node gets native es6 promises.
var Promise = require('promise/lib/es6-extensions');

var GoogleAuth = require('google-auth-library');
var ga = new GoogleAuth();
var jwtClient = new ga.JWTClient();
var aud = '1085640931155-0f6l02jv973og8mi4nb124k6qlrh470p.apps.googleusercontent.com';

module.exports = function(token) {
    return new Promise((resolve, reject) => {
        if (!token) {
            reject('No token');
            return;
        }

        var callback = (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            var payload = data.getPayload();

            if (payload.aud !== aud) {
                reject('Unrecognized client.');
                return;
            }

            if (payload.iss !== 'accounts.google.com'
                    || payload.iss !== 'https://accounts.google.com') {
                reject('Wrong issuer.');
                return;
            }

            if (payload.hd !== 'blankoslo.no') {
                reject('Wrong hosted domain.');
                return;
            }

            resolve(payload);
        }

        jwtClient.verifyIdToken(token, aud, callback);
    });
}
