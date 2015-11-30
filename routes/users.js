var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var user = "";
var password = "";
var sqlite3 = require('sqlite3').verbose();
var ejs = require('ejs');
var fecha = require('./fecha.js');
app.use(bodyParser());
app.post('/', function (req, res) {
	user = localStorage.getItem('user');
	password = localStorage.getItem('password');
	var ruta = "./database/" + user + "/personal.db";
	if (ruta==="./database/null/personal.db"){
		novalidado();
	}
	if (ruta!="./database/null/personal.db"){
	var db = new sqlite3.Database(ruta);
	db.serialize(function () {
		db.run('create table if not exists personal ( _id INTEGER PRIMARY KEY AUTOINCREMENT, idusuario TEXT , nombre TEXT , apellido TEXT , cedula TEXT , fechanac TEXT , empresa TEXT , dpto TEXT , acceso TEXT , huella TEXT )');
		if (req.body.editar >= 1) {
			id = req.body.editar;
			db.each("SELECT _id AS id,* FROM personal WHERE _id = $idaux",
				{ $idaux: id },
				function (err, row) {
					console.log(row.nombre + " " + row.apellido);
					var onoff = boleano2(row.acceso);
					console.log(user);
					res.render(__dirname + '/../views/Editarempleado.jade', { "huella": row.huella, "ci": row.cedula, "acceso": onoff, "nac": row.fechanac, "dpto": row.dpto, "username": row.nombre, "apellido": row.apellido, "id": row._id, "empresa": row.empresa });
				});
		};
		if (req.body.borrar >= 1) {
			var id = req.body.borrar;
			db.each("SELECT _id AS id,* FROM personal WHERE _id = $idaux",
				{ $idaux: id },
				function (err, row) {
					console.log(row.nombre + " " + row.apellido);
					var onoff = boleano2(row.acceso);
					res.render(__dirname + '/../views/Borrarempleado.jade', { "huella": row.huella, "ci": row.cedula, "acceso": onoff, "nac": row.fechanac, "dpto": row.dpto, "username": row.nombre, "apellido": row.apellido, "id": row._id, "empresa": row.empresa });
				});
		};
		if (req.body.Cerrar === "Cerrar Sesion") {
			user = "";
			localStorage.removeItem('user');
			password = "";
			localStorage.removeItem('password');
			app.engine('html', ejs.__express);
			res.render('../public/index.html');
		};
		if (req.body.buscar === 'Exportar por Fecha') {
			res.render(__dirname + '/../views/Exportardatos.jade', { fecha: fecha() });
		}
		if (req.body.nuevo === 'Agregar Nuevo Empleado') {
			res.render(__dirname + '/../views/Nuevoempleado.jade');
		};
	});
	};
	function novalidado(){
app.engine('html', ejs.__express);
res.render('index.html',{title:"Usuario o contraseña no valida, intente nuevamente"});
};
});
function boleano(valor) {
	if (valor === "on") {
		return ("true");
	} else {
		return ("false");
	};
};
function boleano2(valor) {
	if (valor === "true") {
		return ('checked="on"');
	} else {
		return ("");
	};
};
module.exports = app;

