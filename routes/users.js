var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var login = new sqlite3.Database('./database/Usuarios.sqlite');
router.get('/', function(req, res) {
	var LocalStorage = require('node-localstorage').LocalStorage;
var admin = localStorage.getItem('admin');
	if (admin==='admin'){
res.render(__dirname + '/../views/registrausu.jade');
}else{
	res.redirect('/');
};
	});

router.post('/', function (req, res) {
			var usuario=req.body.username;
			var password=req.body.password;
			var tipo="";
			login.serialize(function () {
			var insertar = login.prepare("INSERT INTO users VALUES (?,?,?)");
			insertar.run(usuario, password, tipo);
			insertar.finalize();
			});
});

module.exports = router;
