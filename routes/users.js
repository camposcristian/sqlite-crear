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
	user = req.body.user;
	password = req.body.password;
	var ruta = "./database/" + user + "/personal.db"
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
					res.render(__dirname + '/../views/users.jade', { "huella": row.huella, "ci": row.cedula, "acceso": onoff, "nac": row.fechanac, "dpto": row.dpto, "username": row.nombre, "apellido": row.apellido, "id": row._id, "empresa": row.empresa, user: user, password: password });
				});
		};
		if (req.body.borrar >= 1) {
			var id = req.body.borrar;
			db.each("SELECT _id AS id,* FROM personal WHERE _id = $idaux",
				{ $idaux: id },
				function (err, row) {
					console.log(row.nombre + " " + row.apellido);
					var onoff = boleano2(row.acceso);
					res.render(__dirname + '/../views/borrar.jade', { "huella": row.huella, "ci": row.cedula, "acceso": onoff, "nac": row.fechanac, "dpto": row.dpto, "username": row.nombre, "apellido": row.apellido, "id": row._id, "empresa": row.empresa, user: user, password: password });
				});
		};
		if (req.body.Cerrar === "Cerrar Sesion") {
			user = "";
			password = "";
			app.engine('html', ejs.__express);
			res.render('index.html', { title: "Usuario o contraseña no valida, intente nuevamente", user: user, password: password });
		};
		if (req.body.buscar === 'Exportar por Fecha') {
			res.render(__dirname + '/../views/export.jade', { user: user, password: password, fecha: fecha() });
		}
		if (req.body.nuevo === 'Agregar Nuevo Empleado') {
			res.render(__dirname + '/../views/nuevo.jade', { user: user, password: password });
		};
	});
});
function boleano(valor) {
	if (valor === "on") {
		return ("true");
	}else {
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

