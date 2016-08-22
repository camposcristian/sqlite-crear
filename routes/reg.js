var express = require('express');
var app = express();
var database = [];
var max = 0;
var obtenerBoleano2 = require('./utiles/boleano2.js');
var pjson = require('../package.json');
var x = 0;
var nombre2 = "";
var huellac = "";
var sqlite3 = require('sqlite3').verbose();
var obtenerFecha = require('./utiles/fecha.js');
var obtenerPersonal = require('./utiles/consultas.js');
var obtenerReg = require('./utiles/consultasreg.js');
var obtenerBoleano = require('./utiles/boleano.js');
var fs = require('fs');
var passport = require('passport');





//get /empleados
app.get('/', function (req, res) {
	var user = req.user.username;
	var admin = req.user.admin;
	var idEmpresa=req.user.idEmpresa;
	if (!fs.existsSync('./database/' + idEmpresa)) {
		fs.mkdirSync('./database/' + idEmpresa, 0766, function (err) {
			if (err) {
				console.log(err);
			};
		});
	};
	var ruta = "./database/" + idEmpresa + "/reg.db";
	if (ruta === "./database/null/personal.db") {
		res.redirect('/');
	} else {
		obtenerReg(function (database) {
			max = (database.length);
			res.render(__dirname + '/../views/listareg', { vector: database, max: max, version: pjson.version, admin: admin, user: user });
		}, ruta);
	};
});


//get  api info
app.get('/apps/:id', passport.authenticate('basic', { session: true }),
	obtener
	); 
function obtener(req, res) {
	var idEmpresa=req.user.idEmpresa;
	var id = req.params.id;
	var user = req.user.username;
    var ruta = "./database/" + idEmpresa + "/personal.db";
	if (ruta === "./database/null/personal.db") {
		res.redirect('/');
	} else {
		var db = new sqlite3.Database(ruta);
		db.each("SELECT _id AS id,* FROM personal WHERE _id = $idaux",
			{ $idaux: id },
			function (err, row) {
			res.json(row); 
			});
	};
};

module.exports = app;
