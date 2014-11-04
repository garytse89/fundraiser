var express =  require('express');

app = express()

var http = require('http'),
    path = require('path'),
	colors = require('colors'),
  	connect = require('connect'),
  	frontEndDir = 'dist/app/'

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

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server for "Fundraiser" listening on port %s'.bold.green, app.get('port'));
});

module.exports = app
