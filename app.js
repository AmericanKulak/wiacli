// In order to start the application,
//   Tack on the request logger.
//   Tack on the authorizer (with failure logger)
//   Tack on the various Routers from subsections.

var app = require('express')();
var logger = require('./lib/logger').Logger;
var Identity = require('./lib/identity')
app.set('view engine', 'jade');
app.set('views', ['./views', './lib/wiki/views']);

// Tack on the authorizers


app.use(logger);
app.use(function(req, res, next) {
  var currentUser = /*getUserFromAuthToken*/ Identity.getUserById('PlayerTwo');
  req.user = currentUser;
  next();
})

app.use('/wiki', require('./lib/wiki'));

app.get('/', function (req, res) {
  res.logAndRender('basic', {'whee':'Hello World!'});
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('wiki app listening at http://%s:%s', host, port);
});

