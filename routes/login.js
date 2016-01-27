var express = require('express');
var crypto = require('crypto');
var passport = require('passport');
var path =require('path');
var LocalStrategy = require('passport-local').Strategy;
var app = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database/Users.sqlite');


app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

function hashPassword(password, salt) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  hash.update(salt);
  return hash.digest('hex');
}
passport.use(new LocalStrategy(function (username, password, done) {
  db.get('SELECT salt FROM users WHERE username = ?', username, function (err, row) {
    if (!row) return done(null, false);
    var hash = hashPassword(password, row.salt);
    db.get('SELECT username, id FROM users WHERE username = ? AND password = ?', username, hash, function (err, row) {
      if (!row) return done(null, false);
      // console.log(row)
      return done(null, row);
    });
  });
}));
passport.serializeUser(function (user, done) {
  return done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  db.get('SELECT id, username FROM users WHERE id = ?', id, function (err, row) {
    if (!row) return done(null, false);
    return done(null, row);
  });
});
app.post('/', passport.authenticate('local', { successRedirect: '/empleados',
                                                    failureRedirect: '/' }));
module.exports = app;
