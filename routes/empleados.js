var express = require('express');
var router = express();
var bodyParser = require('body-parser');
var database = [];
var max = 0;
var boleano2 = require('./utiles/boleano2.js');
var pjson = require('../package.json');
var x = 0;
var nombre2 = "";
var huella = "";
var sqlite3 = require('sqlite3').verbose();
var fecha = require('./utiles/fecha.js');
var select = require('./utiles/consultas.js');
var boleano = require('./utiles/boleano.js');

//post empleados/id
router.post('/', function (req, res) {
	var nombre = req.body.username;
	var apellido = req.body.apellido;
	if (req.body.id!=0){
		var id = req.body.id;
	}else{
		id;
	}
	
	var idusu = fecha().toString();
	var ci = req.body.ci;
	var fechanac = req.body.nac;
	var empresa = req.body.empresa;
	var dpto = req.body.dpto;
	var acceso = boleano(req.body.acceso);
	var huella;
	var user = localStorage.getItem('user');
    var ruta = "./database/" + user + "/personal.db";
	var db = new sqlite3.Database(ruta);
	insert();
	function insert() {
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
	nombre2 = "Empleado" + " " + nombre + " " + apellido + " " + "Añadido";
	res.redirect('/empleados');
});
//get /empleados
router.get('/', function (req, res) {
	if (typeof localStorage === "undefined" || localStorage === null) {
		var LocalStorage = require('node-localstorage').LocalStorage;
		localStorage = new LocalStorage('./scratch');
	};
	var user = localStorage.getItem('user');
	select(function (database) {
		if (database === 'error') {
			res.redirect('/');
		} else {
			max = (database.length);
			if (nombre2 === "") {
				nombre2 = "Bienvenido " + user;
			}
			res.render(__dirname + '/../views/listaemp', { vector: database, max: max, nombre2: nombre2, version: pjson.version });
			nombre2 = "";
		}
	});
});
//delete empleados/id
router.delete('/:id', function (req, res) {
	var id = req.params.id;
	var user = localStorage.getItem('user');
    var ruta = "./database/" + user + "/personal.db";
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
});
//put empleados/id
router.put('/:id', function (req, res) {
	var nombre = req.body.username;
	var apellido = req.body.apellido;
	var id = req.params.id;
	var idusu = fecha().toString();
	var ci = req.body.ci;
	var fechanac = req.body.nac;
	var empresa = req.body.empresa;
	var dpto = req.body.dpto;
	var acceso = boleano(req.body.acceso);
	var huella;
	var user = localStorage.getItem('user');
    var ruta = "./database/" + user + "/personal.db";
	var db = new sqlite3.Database(ruta);
	db.each("SELECT _id AS _id,huella FROM personal WHERE _id = $useraux",
		{ $useraux: id },
		function (err, row) {
			huella = row.huella;
		}, function (err, rows) {
			if (rows != 0) {
				insert();
			};
		});
	function insert() {
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
});
// get confirmar eliminacion
router.get('/confirmar/:id', function (req, res) {
	var id = req.params.id;
	var user = localStorage.getItem('user');
    var ruta = "./database/" + user + "/personal.db";
	var db = new sqlite3.Database(ruta);
	db.each("SELECT _id AS id,* FROM personal WHERE _id = $idaux",
		{ $idaux: id },
		function (err, row) {
			console.log(row.nombre + " " + row.apellido);
			var onoff = boleano2(row.acceso);
			res.render(__dirname + '/../views/borraremp.jade', { 'vector': row, 'onoff': onoff });
		});
});
// get menu edicion
router.get('/editar/:id', function (req, res) {
	var id = req.params.id;
	var user = localStorage.getItem('user');
    var ruta = "./database/" + user + "/personal.db";
	var db = new sqlite3.Database(ruta);
	db.each("SELECT _id AS id,* FROM personal WHERE _id = $idaux",
		{ $idaux: id },
		function (err, row) {
			console.log(row.nombre + " " + row.apellido);
			var onoff = boleano2(row.acceso);
			res.render(__dirname + '/../views/editaremp.jade', { 'vector': row, 'onoff': onoff });
		});
});
// get menu nuevo 
router.get('/nuevo', function (req, res) {
	res.render(__dirname + '/../views/nuevoemp.jade', { 'fecha': fecha() });
});


module.exports = router;
