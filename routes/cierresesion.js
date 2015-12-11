var express = require('express');
var router = express();
var ejs = require('ejs');
var fecha = require('./utiles/fecha.js');
router.get('/', function (req, res) {
	localStorage.removeItem('user');
	localStorage.removeItem('password');
	localStorage.removeItem('admin');
	res.redirect('/')
});
module.exports = router;