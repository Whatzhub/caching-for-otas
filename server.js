var express = require('express');
var responseTime = require('response-time');
var bodyParser = require('body-parser');
var redis = require('redis');
var uapiFareSearch = require('./helpers/fareSearch');
var helpers = require('./helpers/helpers');

var app = express();
var server = require('http').Server(app);

var redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});

redisClient.on('error', (err) => {
    console.log("redisClient Error: ", err);
});

// setup middlewares
app.use(express.static(__dirname + '/src'));
app.use(bodyParser.json());
app.use(responseTime());

// define PORT
var PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
});

app.post('/faresearch', (req, res) => {
    var body = req.body;
    var origin = body.origin;
    var destination = body.destination;
    var from = body.from;
    var to = body.to;

    // define redis key
    var redisKey = `${origin}${destination}${from}${to}`;
    console.log('Redis Key: ', redisKey);

    // check if cache has data
    redisClient.get(redisKey, (err, reply) => {
        if (err) console.log('redisClient Retrieve Error: ', err);
        var totalSegments = reply;

        // return cache data if redisKey exists
        if (totalSegments) {
            var cacheJson = {
                success: true,
                type: 'cache',
                message: 'Cached. Results from Redis.',
                data: {
                    totalSegments: totalSegments
                }
            };
            console.log(cacheJson);
            return res.json(cacheJson);
        }

        // otherwise, fire an actual API request
        else {
            helpers.fareSearchWithHttps(uapiFareSearch.request, uapiFareSearch.body(origin, destination, from, to))
                .then(data => {
                    // console.log(61, data);
                    var results = JSON.parse(data);
                    var segments = results.AirSegmentList['$values'];
                    var totalSegments = segments.length;

                    // store the returned solutions in our cache with an expiry of 5 seconds
                    redisClient.setex(redisKey, 5, totalSegments);

                    var noCacheJson = {
                        success: true,
                        type: 'api_request',
                        message: 'No Cache. Results from API request.',
                        data: {
                            totalSegments: totalSegments
                        }
                    };
                    console.log(noCacheJson);
                    return res.json(noCacheJson);
                })
                .catch(err => {
                    console.log('API Request Error: ', err);
                    var errorJson = {
                        success: false,
                        type: null,
                        message: 'No Cache. Results from API request failed.',
                        data: null
                    };
                    return res.json(errorJson);
                });
        }
    });
});

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
    console.log(__dirname);
})