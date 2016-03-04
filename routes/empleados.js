var express = require('express');
var app = express();
var database = [];
var max = 0;
var obtenerBoleano2 = require('./utiles/boleano2.js');
var pjson = require('../package.json');
var x = 0;
var nombre2 = "";
var huella = "";
var sqlite3 = require('sqlite3').verbose();
var obtenerFecha = require('./utiles/fecha.js');
var obtenerPersonal = require('./utiles/consultas.js');
var obtenerBoleano = require('./utiles/boleano.js');
var fs = require('fs');
var passport = require('passport');

//para api
app.post('/api', passport.authenticate('basic', { session: true }),
	nuevoEmpleado
	); 

//post empleados
app.post('/', nuevoEmpleado);
function nuevoEmpleado(req, res) {
	var nombre = req.body.username;
	var apellido = req.body.apellido;
	if (req.body.id != 0) {
		var id = req.body.id;
	} else {
		id;
	}
	var idusu = obtenerFecha().toString();
	var ci = req.body.ci;
	var fechanac = req.body.nac;
	var empresa = req.body.empresa;
	var dpto = req.body.dpto;
	var acceso = obtenerBoleano(req.body.acceso).toString();
	var huella;
    
    console.log(huella);
	var user = req.user.username;
    var ruta = "./database/" + user + "/personal.db";
	if (ruta === "./database/null/personal.db") {
		res.redirect('/');
	} else {
		var db = new sqlite3.Database(ruta);
		insertarBd();
		function insertarBd() {
			var borrar = db.prepare("DELETE FROM personal WHERE _id=(?)");
			borrar.run(id);
			borrar.finalize();
			huella = "Sin Enrolar";
			var insertar = db.prepare("INSERT INTO personal VALUES (?,?,?,?,?,?,?,?,?,?)");
			insertar.run(id, idusu, nombre, apellido, ci, fechanac, empresa, dpto, acceso, huella);
			insertar.finalize();
		};
		nombre2 = "Empleado" + " " + nombre + " " + apellido + " " + "Añadido";
		res.redirect('/empleados');
	};
};

//get /empleados
app.get('/', function (req, res) {
	var user = req.user.username;
	var admin = req.user.admin;
	if (!fs.existsSync('./database/' + user)) {
		fs.mkdirSync('./database/' + user, 0766, function (err) {
			if (err) {
				console.log(err);
			};
		});
	};
	var ruta = "./database/" + user + "/personal.db";
	if (ruta === "./database/null/personal.db") {
		res.redirect('/');
	} else {
		obtenerPersonal(function (database) {
			max = (database.length);
			if (nombre2 === "") {
				nombre2 = "Bienvenido " + user;
			}
			res.render(__dirname + '/../views/listaemp', { vector: database, max: max, nombre2: nombre2, version: pjson.version, admin: admin, user: user });
			nombre2 = "";
		}, ruta);
	};
});
//delete empleados/id
app.delete('/:id', function (req, res) {
	var id = req.params.id;
	var user = req.user.username;
    var ruta = "./database/" + user + "/personal.db";
	if (ruta === "./database/null/personal.db") {
		res.redirect('/');
	} else {
		var db = new sqlite3.Database(ruta);
		db.each("SELECT _id AS id,* FROM personal WHERE _id = $idaux",
			{ $idaux: id },
			function (err, row) {
				var borrar = db.prepare("DELETE FROM personal WHERE _id=(?)");
				borrar.run(id);
				borrar.finalize();
				nombre2 = "Empleado" + " " + row.nombre + " " + row.apellido + " " + "Eliminado";
				res.redirect('/empleados');
			});
	};
});
//put empleados/id
app.put('/:id', function (req, res) {
	var nombre = req.body.username;
	var apellido = req.body.apellido;
	var id = req.params.id;
	var idusu = obtenerFecha().toString();
	var ci = req.body.ci;
	var fechanac = req.body.nac;
	var empresa = req.body.empresa;
	var dpto = req.body.dpto;
	var acceso = obtenerBoleano(req.body.acceso).toString();
	var huella;
	var user = req.user.username;
    var ruta = "./database/" + user + "/personal.db";
	if (ruta === "./database/null/personal.db") {
		res.redirect('/');
	} else {
		var db = new sqlite3.Database(ruta);
		db.each("SELECT _id AS _id,huella FROM personal WHERE _id = $useraux",
			{ $useraux: id },
			function (err, row) {
				huella = row.huella;
			}, function (err, rows) {
				if (rows != 0) {
					insertarBd();
				};
			});
		function insertarBd() {
			var borrar = db.prepare("DELETE FROM personal WHERE _id=(?)");
			borrar.run(id);
			borrar.finalize();
			if (huella === "Sin Enrolar" || huella === null) {
				huella = "Sin Enrolar";
			}
			var insertar = db.prepare("INSERT INTO personal VALUES (?,?,?,?,?,?,?,?,?,?)");
			insertar.run(id, idusu, nombre, apellido, ci, fechanac, empresa, dpto, acceso, huella);
			insertar.finalize();
		}
		nombre2 = "Empleado" + " " + nombre + " " + apellido + " " + "Actualizado";
		res.redirect('/empleados');
	};
});
// get confirmar eliminacion
app.get('/confirmar/:id', function (req, res) {
	var id = req.params.id;
	var user = req.user.username;
    var ruta = "./database/" + user + "/personal.db";
	if (ruta === "./database/null/personal.db") {
		res.redirect('/');
	} else {
		var db = new sqlite3.Database(ruta);
		db.each("SELECT _id AS id,* FROM personal WHERE _id = $idaux",
			{ $idaux: id },
			function (err, row) {
				console.log(row.nombre + " " + row.apellido);
				var onoff = obtenerBoleano2(row.acceso);
               // return row;
				res.render(__dirname + '/../views/borraremp.jade', { 'vector': row, 'onoff': onoff });
			});
	};
});
// get menu edicion
app.get('/editar/:id', function (req, res) {
	var id = req.params.id;
	var user = req.user.username;
    var ruta = "./database/" + user + "/personal.db";
	if (ruta === "./database/null/personal.db") {
		res.redirect('/');
	} else {
		var db = new sqlite3.Database(ruta);
		db.each("SELECT _id AS id,* FROM personal WHERE _id = $idaux",
			{ $idaux: id },
			function (err, row) {
				console.log(row.nombre + " " + row.apellido);
				var onoff = obtenerBoleano2(row.acceso);
				res.render(__dirname + '/../views/editaremp.jade', { 'vector': row, 'onoff': onoff });
			});
	};
});
// get menu nuevo 
app.get('/nuevo', function (req, res) {
	var user = req.user.username;
	var ruta = "./database/" + user + "/personal.db";
	if (ruta === "./database/null/personal.db") {
		res.redirect('/');
	} else {
		res.render(__dirname + '/../views/nuevoemp.jade', { 'fecha': obtenerFecha() });
	};
});
//get  api info
app.get('/apps/:id', passport.authenticate('basic', { session: true }),
	obtener
	); 
function obtener(req, res) {
	var id = req.params.id;
     console.log(id);
	var user = req.user.username;
    var ruta = "./database/" + user + "/personal.db";
    console.log(ruta);
	if (ruta === "./database/null/personal.db") {
		res.redirect('/');
	} else {
		var db = new sqlite3.Database(ruta);
		db.each("SELECT _id AS id,* FROM personal WHERE _id = $idaux",
			{ $idaux: id },
			function (err, row) {
                console.log(row);
			res.json(row); //esto faltaba
			});
	};
};

module.exports = app;
