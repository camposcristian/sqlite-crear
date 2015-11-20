var express = require('express');
var router = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('personal.db');
var fecha = require('./fecha.js');
var nombre2 = ""
console.log("test")


router.post('/', function (req, res) {
	res.render(__dirname + '/../views/.html', { "variable":"Hola"});
	db.serialize(function () {
		//db.run('CREATE TABLE "personal" (Nombre TEXT,Apellido Text)');

			db.each("SELECT _id AS id,* FROM personal WHERE _id = $idaux",
				{ $idaux: id },
				function (err, row) {
					console.log(row.nombre + " " + row.apellido)
					var onoff = boleano2(row.acceso);
					//huella=row.huella
					

				}
				);
		})
		



		//db.close();
	});





module.exports = router;


