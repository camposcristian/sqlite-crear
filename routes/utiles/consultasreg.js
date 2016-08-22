module.exports = function select(callback,ruta) {
	var sqlite3 = require('sqlite3').verbose();
	var db = new sqlite3.Database(ruta);
	db.serialize(function () {
	  db.run('create table if not exists reg (id TEXT , fecha TEXT , hora TEXT , nombre TEXT , apellido TEXT , cedula TEXT ,empresa TEXT, subempresa TEXT , equipo TEXT ,marca TEXT ,mmark TEXT,acceso TEXT,observaciones TEXT )');      
		db.all("SELECT * FROM reg",
			function (err, rows) {
				callback(rows);
			});
		  });
};
