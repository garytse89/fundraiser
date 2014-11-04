var home_directory = __dirname;
var path = require('path')
// require from controller
global.middleware = function(module) {
	return require(path.join(home_directory, 'middleware', module))
}
// require from local modules
global.local_module = function(module) {
	return require(path.join(home_directory, 'local_modules', module))
}
// require from lib
global.lib = function(module) {
	return require(path.join(home_directory, 'lib', module))
}

process.on('uncaughtException', function(err) {
  console.log(err.stack)
})

var express = require('express');
var http = require('http');
var app = express();

global.app = app;

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'html'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res, next) {
  return res.render('app/views/main.html')
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
