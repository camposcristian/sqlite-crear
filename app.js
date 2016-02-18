var pjson = require('./package.json');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
console.log("Versión " + pjson.version);
var usuarios = require('./routes/usuarios');
var empleados = require('./routes/empleados');
var login = require('./routes/login');
var exportar = require('./routes/exportar');
var cierresesion = require('./routes/cierresesion');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();

app.use(express.static('public'));
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}))

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use('/usuarios', usuarios);
app.use('/empleados', empleados);
app.use('/login', login);
app.use('/cierresesion', cierresesion);
app.use('/exportar', exportar);


app.get('/', function (req, res) {
 // if (req.user){
   // res.redirect('/login')
  //}else{
   // res.redirect('/empleados');
  //}
  res.redirect('/login')
});






// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


var port = process.env.PORT || 1337;
app.listen(port);
module.exports = app;
