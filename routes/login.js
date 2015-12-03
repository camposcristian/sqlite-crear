var express = require('express');
var router = express();
var ejs = require('ejs');
var sqlite3 = require('sqlite3').verbose();
var login = new sqlite3.Database('./database/Usuarios.sqlite');
var nombre2 = "";
router.post('/', function (req, res) {
	if (typeof localStorage === "undefined" || localStorage === null) {
		var LocalStorage = require('node-localstorage').LocalStorage;
		localStorage = new LocalStorage('./scratch');
	};
	localStorage.setItem('password', req.body.password);
	localStorage.setItem('user', req.body.user);
	var user = localStorage.getItem('user');
	var password = localStorage.getItem('password');
	nombre2 = "Bienvenido " + user;
	login.serialize(function () {
		login.each("SELECT rowid AS rowid,* FROM users WHERE user = $useraux",
			{ $useraux: user },
			function (err, row) {
				if (row.user === user) {
					if (row.password === password) {
						validado();
					} else {
						novalidado();
					};
				};
			}, function (err, rows) {
				if (rows === 0) {
					novalidado();
				};
			});
	});
	function novalidado() {
		router.engine('html', ejs.__express);
		res.render('index.html', { title: "Usuario o contraseña no valida, intente nuevamente" });
	};
	function validado() {
		res.redirect('/empleados');
	};
});
module.exports = router;
