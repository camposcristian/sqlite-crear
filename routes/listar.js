var express = require('express');
var router = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('personal.db');
var fecha = require('./fecha.js');
var fs = require('fs')
var database = [];
var nombre2=""
var async = require("async");
//var vector = [];
var i=0;
var x=0;
var max=0;
	db.serialize(function () {
		db.run('create table if not exists personal (_id INTEGER PRIMARY KEY AUTOINCREMENT, idusuario TEXT , nombre TEXT , apellido TEXT , cedula TEXT , fechanac TEXT , empresa TEXT , dpto TEXT , acceso TEXT , huella TEXT )');
		select();
		function select(){
		db.each("SELECT _id AS id,* FROM personal",
			function (err, row) {
				var onoff = boleano2(row.acceso);
				x++
				 database[x]={
					id:row.id,
					nombre:row.nombre,
					apellido:row.apellido,
					ci:row.cedula,
					fechanac:row.fechanac,
					dpto:row.dpto,
					idusu:row.idusu,
					acceso:boleano2(row.acceso)
				};	
			});
			max=x
			x=0
		}
router.post('/', function (req, res) {
	console.log('normal')
	var nombre = req.body.username;
	var apellido = req.body.apellido;
	var id = req.body.id;
	var idusu = fecha().toString()
	var ci = req.body.ci;
	var fechanac = req.body.nac;
	var empresa = req.body.empresa;
	var dpto = req.body.dpto;
	var acceso = boleano(req.body.acceso);
	var huella=req.body.huella;
	
	
	if (req.body.exportar === 'exportar') {
		select()
		var desdepar= req.body.desdepar;
		var hastapar= req.body.hastapar;
		console.log(desdepar)
		console.log(hastapar)
   for (var x = desdepar; x <= hastapar; x++){
	  // i++
	//   	fs.appendFile('./database.txt',database[i].id+','+database[i].nombre+','+database[i].apellido+','+database[i].ci+'\r\n', function (err) {
        //    if (err) {
          //      console.log('error');
           // }});
		   //hay que hacer select por fecha
   }	
		nombre2="Se ha exportado el archivo"
		x=0;
		i=0;
	}
	
	
	
	
		if (req.body.iniciar === 'iniciar') {
			select(function(){console.log('nuevo')})
		}
	
	db.serialize(function () {
		if (req.body.grabar === 'grabar') {
			console.log('grabar')
			var borrar = db.prepare("DELETE FROM personal WHERE _id=(?)");
			borrar.run(id);
			borrar.finalize();
			var insertar = db.prepare("INSERT INTO personal VALUES (?,?,?,?,?,?,?,?,?,?)");
			insertar.run(id, idusu, nombre, apellido, ci, fechanac, empresa, dpto, acceso, huella);
			insertar.finalize();
			nombre2="Usuario"+" "+nombre+" "+apellido+" "+"Actualizado"
			select()
	
			
		};
		if (req.body.borrar === 'borrar') {
			console.log('borrar')
			var borrar = db.prepare("DELETE FROM personal WHERE _id=(?)");
			borrar.run(id);
			borrar.finalize();
			nombre2="Usuario"+" "+nombre+" "+apellido+" "+"Eliminado"
			select()
			
	
		};
	});

	console.log('res')
	res.render(__dirname + '/../views/lista', {vector:database,max:max,nombre2:nombre2});
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

module.exports = router;

