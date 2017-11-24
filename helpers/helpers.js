var https = require('https');
var zlib = require('zlib');

var Helpers = {};

Helpers.fareSearchWithHttps = function (fareSearchObj, bodyParams) {
    var timer = 0;

    var options = {
        hostname: fareSearchObj.host,
        path: fareSearchObj.path || '',
        port: 443,
        method: fareSearchObj.method || 'POST',
        headers: fareSearchObj.headers || {}
    };

    var timeLapsed = setInterval(() => {
        timer += 1;
        if (timer > 30) clearInterval(timeLapsed);
        console.log('Time lapsed:', fareSearchObj.host, timer, 'secs...');
    }, 1000);

    return new Promise((resolve, reject) => {
        var req = https.request(options, (res) => {
            console.log('STATUS: ', res.statusCode);
            console.log('HEADERS: ', JSON.stringify(res.headers));

            var data = '';
            var gunzip = zlib.createGunzip();
            res.pipe(gunzip);

            gunzip.on('data', (chunk) => {
                data += chunk.toString();
                // console.log(data);
            });

            gunzip.on('end', () => {
                console.log('Response done' + '\n');
                clearInterval(timeLapsed);
                resolve(data);
            });
        });

        req.on('error', (err) => {
            console.log(`problem with request: ${err.message}`);
            clearInterval(timeLapsed);
            reject(err);
        });

        if (bodyParams) req.write(bodyParams);
        req.end();
    });
}

module.exports = Helpers;