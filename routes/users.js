var express = require('express');
var router = express.Router();
router.get('/', function(req, res) {
	var LocalStorage = require('node-localstorage').LocalStorage;
var admin = localStorage.getItem('admin');
	if (admin==='admin'){
res.render(__dirname + '/../views/registrausu.jade');
}else{
	res.redirect('/');
};
	});

module.exports = router;
