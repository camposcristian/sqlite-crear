module.exports= function calcula() {
var express = require('express');
var router = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('personal.db');
var fecha = require('./fecha.js');
var fs = require('fs')
var database = [];

//var vector = [];
var i;
	db.serialize(function () {
		//db.run('CREATE TABLE "personal" (Nombre TEXT,Apellido Text)');
		
		db.each("SELECT _id AS id,* FROM personal",
			function (err, row) {
				//console.log(row.nombre + " " + row.apellido)
				var onoff = boleano2(row.acceso);
				//huella=row.huella
				 database[row.id]={
					id:row.id,
					nombre:row.nombre,
					apellido:row.apellido
				};	
				
			});
		
			



		//db.close();
	});
	console.log(database[7])
				


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
}


