var express =  require('express');

app = express()

var http = require('http'),
    path = require('path'),
	colors = require('colors'),
  	connect = require('connect'),
  	frontEndDir = 'dist/app/';

 if (process.env.NODE_ENV !== 'production') {
	process.env.REDIS_HOSTNAME = 'localhost'
	process.env.REDIS_PORT = 6379
	process.env.REDIS_AUTH = ''
};

app.set('views', path.join(__dirname, frontEndDir));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.bodyParser());
app.use(express.methodOverride());
// app.use(express.multipart());
app.use(express.static(path.join(__dirname, frontEndDir)));

app.use(app.router);

// home page
app.get('/', function(req, res, next) {
  return res.render('index.html')
})

app.set('port', process.env.PORT || 8080);

global.Models = require('./config/mongoose')('fundraising')

require('./api')(app)

var server = http.createServer(app)

server.listen(app.get('port'), function() {
  console.log('Express server for "Fundraiser" listening on port %s'.bold.green, app.get('port'));
});

var redis = require('redis')
var io = require('socket.io')(server),
    socketio_redis = require('socket.io-redis'),
    pubClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOSTNAME, { auth_pass: process.env.REDIS_AUTH, return_buffers: true }),
    subClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOSTNAME, { auth_pass: process.env.REDIS_AUTH, return_buffers: true });


io.adapter(socketio_redis({ 
  host: process.env.REDIS_HOSTNAME,
  port: process.env.REDIS_PORT,
  auth: process.env.REDIS_AUTH,
  pubClient: pubClient,
  subClient: subClient 
}))

module.exports = app
