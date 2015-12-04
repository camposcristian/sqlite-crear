var sqlite3 = require('sqlite3').verbose();
var user = "Test"
var ruta = "./database/" + user + "/personal.db";
var db = new sqlite3.Database(ruta);
module.exports = function select(callback) {
	       db.serialize(function () {
			db.run('create table if not exists personal (_id INTEGER PRIMARY KEY AUTOINCREMENT, idusuario TEXT , nombre TEXT , apellido TEXT , cedula TEXT , fechanac TEXT , empresa TEXT , dpto TEXT , acceso TEXT , huella TEXT )');
			db.all("SELECT _id AS id,* FROM personal",
				function (err, rows) {
				callback(rows);		
})
		  })}

   
 