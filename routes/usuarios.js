var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var login = new sqlite3.Database('./database/Users.sqlite');

router.get('/contrasena', function (req, res) {
	var usuario = req.user.username;
	var idEmpresa=req.user.idEmpresa;
	res.render(__dirname + '/../views/contrasena.jade', { usuario: usuario,idEmpresa:idEmpresa });
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
	var responsable = req.user.username;
	var username = req.body.username;
	var idEmpresa= req.body.idEmpresa;
	var id;
	var password = req.body.password;
	var password2 = req.body.password2;
	var salt="Crear2016"
	var admin = req.user.admin;
	if (req.body.type === 'on') {
		var tipo = "admin";
	} else {
		tipo = "normal";
	};
	if (password2 === password) {
		if (password.length < 5) {
			if (username===responsable){
			res.render(__dirname + '/../views/contrasena.jade', { info: 'Contraseña muy corta', usuario: username });
			}else{
			res.render(__dirname + '/../views/registrausu.jade', { info: 'Contraseña muy corta'});
			};
			
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
			var insertar = login.prepare("INSERT INTO users VALUES (?,?,?,?,?,?,?)");
			if(username===responsable){
			insertar.run(id, username, hash, salt, admin, responsable,idEmpresa);
			}else{
			insertar.run(id, username, hash, salt, tipo, responsable,idEmpresa);	
			};
			insertar.finalize();
			if (username===responsable){
			res.render(__dirname + '/../views/index.jade', { mensaje: 'Contraseña cambiada' });
			}else{
			res.render(__dirname + '/../views/registrausu.jade', { info: 'Usuario ' + username + ' registrado' });
			};
		})};
	} else {
		if (username===responsable){
			res.render(__dirname + '/../views/contrasena.jade', { info: 'Contraseñas no coinciden', usuario: username });
			}else{
			res.render(__dirname + '/../views/registrausu.jade', { info: 'Contraseñas no coinciden' });
			};
	};
});

module.exports = router;