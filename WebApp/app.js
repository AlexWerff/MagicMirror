var port = process.env.PORT || 3000;



// set up ========================
var express = require('express');
var app = express(); // create our app w/ express
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// configuration =================

// Enable reverse proxy support in Express. This causes the
// the "X-Forwarded-Proto" header field to be trusted so its
// value can be used to determine the protocol. See
// http://expressjs.com/api#app-settings for more details.
app.enable('trust proxy');


var compress = require('compression');

app.use(compress());




//IMPORTANT! ADD WHEN UPLOADING TO SERVER!
/*app.use(function (req, res, next) {
    if (req.secure) {
        // request was via https, so do no special handling
        next();
    } else {
        // request was via http, so redirect to https
        res.redirect('https://' + req.headers.host + req.url);
    }
});*/

app.use(express.static(__dirname + '/client')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(methodOverride());


var apiRoutesController = require('./server/api-routes.controller.js');
apiRoutesController.setRoutesForApp(app);

var ioRouter = require('./server/io-router.js');

io.on('connection', function (client) {
    ioRouter.createRoutesForNoble(client);
    ioRouter.createRoutesForSpotify(client);
});


// listen (start app with node server.js) ======================================
server.listen(port);
console.log("App listening on port " + port);