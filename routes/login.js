var express = require('express');
var crypto = require('crypto');
var passport = require('passport');
var path =require('path');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy= require('passport-http').BasicStrategy;
var app = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database/Users.sqlite');
//estrategia para http
//app.post('/api',passport.authenticate('basic', { session: true}),
 // function(req, res) {
  //  console.log(req.user);
  //  res.json(req.user);
  //}); 
  passport.use(new BasicStrategy(function(username, password, done) {
 db.get('SELECT salt FROM users WHERE username = ?', username, function (err, row) {
    if (!row) return done(null, false);
    var hash = hashPassword(password, row.salt);
    db.get('SELECT username, id FROM users WHERE username = ? AND password = ?', username, hash, function (err, row) {
      if (!row) return done(null, false);
      return done(null, row);
    });
  });
}));
 //get no validado
app.get('/novalidado', function (req, res) {
	res.render(__dirname + '/../views/index', { 'mensaje': "Usuario o Contraseña incorrecta"});
});

//get index
app.get('/',function(req,res){
  res.render(__dirname + '/../views/index');
});
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
      return done(null, row);
    });
  });
}));
passport.serializeUser(function (user, done) {
  return done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  db.get('SELECT id,admin, username,idEmpresa FROM users WHERE id = ?', id, function (err, row) {
    if (!row) return done(null, false);
    return done(null, row);
  });
});
app.post('/', passport.authenticate('local', { successRedirect: '/empleados',
                                                    failureRedirect: '/login/novalidado' }));
module.exports = app;
