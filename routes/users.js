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
			var password2=req.body.password2;
			if (req.body.type==='on'){
			var tipo="admin";
			}else{
			tipo="";
			};
			if (password2===password){
			login.serialize(function () {
			var insertar = login.prepare("INSERT INTO users VALUES (?,?,?)");
			insertar.run(usuario, password, tipo);
			insertar.finalize();
			res.render(__dirname + '/../views/registrausu.jade',{info:'Usuario '+usuario+' registrado'});
			});
			}else{
			res.render(__dirname + '/../views/registrausu.jade',{info:'Contraseñas no coinciden'});
			};
});

module.exports = router;
