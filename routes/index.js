var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//router.get('/', function(req, res ,next) {
//var username= res.send('Username: ' + req.query['username']);
//console.log(username);
//});

module.exports = router;
