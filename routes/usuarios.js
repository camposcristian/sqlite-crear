var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var login = new sqlite3.Database('./database/Users.sqlite');

router.get('/contrasena', function (req, res) {
	console.log("test")
});

router.get('/', function (req, res) {
	var admin = req.user.admin;
	if (admin === 'admin') {
		res.render(__dirname + '/../views/registrausu.jade');
	} else {
		res.redirect('/');
	};
});

router.post('/', function (req, res) {
	var username = req.body.username;
	var responsable = req.user.username;
	var id;
	var password = req.body.password;
	var password2 = req.body.password2;
	var salt="Crear2016"
	
	if (req.body.type === 'on') {
		var tipo = "admin";
	} else {
		tipo = "normal";
	};
	if (password2 === password) {
		if (password.length < 5) {
			res.render(__dirname + '/../views/registrausu.jade', { info: 'Contraseña muy corta' });
		}else{
		 
var hash = hashPassword(password, salt);	
function hashPassword(password, salt) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  hash.update(salt);
  return hash.digest('hex');
}

		login.serialize(function () {
			var borrar = login.prepare("DELETE FROM users WHERE username=(?)");
			borrar.run(username);
			borrar.finalize();
			var insertar = login.prepare("INSERT INTO users VALUES (?,?,?,?,?,?)");
			insertar.run(id, username, hash, salt, tipo, responsable);
			insertar.finalize();
			res.render(__dirname + '/../views/registrausu.jade', { info: 'Usuario ' + username + ' registrado' });
		})};
	} else {
		res.render(__dirname + '/../views/registrausu.jade', { info: 'Contraseñas no coinciden' });
	};
});

module.exports = router;
