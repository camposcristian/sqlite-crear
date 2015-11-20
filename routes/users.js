var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('personal.db');
app.use(bodyParser());
app.post('/', function(req, res) {
db.serialize(function () {
db.run('create table if not exists personal ( _id INTEGER PRIMARY KEY AUTOINCREMENT, idusuario TEXT , nombre TEXT , apellido TEXT , cedula TEXT , fechanac TEXT , empresa TEXT , dpto TEXT , acceso TEXT , huella TEXT )');
 if (req.body.editar >=1) {
  id=req.body.editar
db.each("SELECT _id AS id,* FROM personal WHERE _id = $idaux",
				{ $idaux: id },
				function (err, row) {
					console.log(row.nombre + " " + row.apellido)
					var onoff = boleano2(row.acceso);
					res.render(__dirname + '/../views/users.jade', { "huella":row.huella,"ci": row.cedula, "acceso": onoff, "nac": row.fechanac, "dpto": row.dpto, "username": row.nombre, "apellido": row.apellido, "id": row._id, "empresa": row.empresa });
				})
  };
  
  if (req.body.borrar >=1) {
    var id = req.body.borrar
   db.each("SELECT _id AS id,* FROM personal WHERE _id = $idaux",
				{ $idaux: id },
				function (err, row) {
					console.log(row.nombre + " " + row.apellido)
					var onoff = boleano2(row.acceso);
					res.render(__dirname + '/../views/borrar.jade', { "huella":row.huella,"ci": row.cedula, "acceso": onoff, "nac": row.fechanac, "dpto": row.dpto, "username": row.nombre, "apellido": row.apellido, "id": row._id, "empresa": row.empresa });
				})
   
  }
 if (req.body.actualizar ==="actualizar") {
res.render(__dirname + '/../views/index.jade',{id:id});
 };
 	if (req.body.buscar === 'buscar') {
		var desde = req.body.desde;
		var hasta = req.body.hasta;
		var desdepar=(new Date(desde).getTime() / 1000).toFixed(0);
		var hastapar=(new Date(hasta).getTime() / 1000).toFixed(0);
		res.render(__dirname + '/../views/export.jade', {desde:desde,hasta:hasta,hastapar:hastapar,desdepar:desdepar});
				}
		//hacer calculos dentro de la feecha
  })
}); 

function boleano(valor) {
	if (valor === "on") {
		return ("true")
	}
	else {
		return ("false")
	}
}

function boleano2(valor) {
	if (valor === "true") {
		return ('checked="on"')
	} else {
		return ("")
	}
}



module.exports = app;

