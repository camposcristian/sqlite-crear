var express = require('express');
var crypto = require('crypto');
var passport=require('passport');
var LocalStrategy = require('passport-local').Strategy;
var router = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database/Users.sqlite');
router.use(passport.initialize());
router.use(passport.session());
function hashPassword(password, salt) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  hash.update(salt);
  return hash.digest('hex');
}
passport.use(new LocalStrategy(function(username, password, done) {
  db.get('SELECT salt FROM users WHERE username = ?', username, function(err, row) {
    if (!row) return done(null, false);
    var hash = hashPassword(password, row.salt);
    db.get('SELECT username, id FROM users WHERE username = ? AND password = ?', username, hash, function(err, row) {
      if (!row) return done(null, false);
    // console.log(row)
      return done(null, row);
    });
  });
}));
passport.serializeUser(function(user, done) {
  return done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  db.get('SELECT id, username FROM users WHERE id = ?', id, function(err, row) {
    if (!row) return done(null, false);
    return done(null, row);
  });
});
router.post('/', passport.authenticate('local', {  failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/empleados');
  });

module.exports = router;
