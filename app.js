var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var yaml = require('js-yaml');
var fs = require('fs');
db = new (require('./lib/orgdb.js'));
db.init("orgs/");

global_config = yaml.safeLoad(fs.readFileSync('_config.yml', 'utf8'));
theme_config = yaml.safeLoad(fs.readFileSync('_theme.yml', 'utf8'));

var routes = require('./routes/index')
var pluto = require('./routes/pluto')
var users = require('./routes/users');
var tags = require('./routes/tags');
var cats = require('./routes/cats');
var archives = require('./routes/archives');
var post = require('./routes/post');
var jsnes = require('./routes/jsnes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/jsnes', jsnes);
app.use('/tags', tags);
app.use('/pluto', pluto);
app.use('/cats', cats);
app.use('/archives', archives);
app.use('/', routes);
app.use('/orgs', users);
app.use('/post', post);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
