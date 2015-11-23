var https = require('https');

// TODO: Remove whenever node gets native es6 promises.
var Promise = require('promise/lib/es6-extensions');

var googAuthUri = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='

module.exports = function(token) {
    return new Promise((resolve, reject) => {
        if (!token) {
            reject('No token');
            return;
        }

        var handleGoogleResponse = (data) => {
            if (data.error_description) {
                reject(data.error_description);
                return;
            }

            if (data.hd !== 'blankoslo.no') {
                reject('Wrong (or no) domain.');
                return;
            }

            resolve(data);
        }

        var authReq = https.get(googAuthUri+token, (authRes) => {
            var body = '';

            authRes.on('data', (block) => {
                body += block;
            });

            authRes.on('end', () => {
                handleGoogleResponse(JSON.parse(body));
            });
        }).on('error', reject);
    });
}
