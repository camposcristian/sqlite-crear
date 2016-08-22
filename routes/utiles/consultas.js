module.exports = function select(callback,ruta) {
	var sqlite3 = require('sqlite3').verbose();
	var db = new sqlite3.Database(ruta);
	db.serialize(function () {
		db.run('create table if not exists personal (_id INTEGER PRIMARY KEY AUTOINCREMENT, fechaact TEXT , nombre TEXT , apellido TEXT , cedula TEXT , fechanac TEXT , subempresa TEXT , dpto TEXT , acceso TEXT ,habkyb TEXT , huellac TEXT )');
		db.all("SELECT _id AS id,* FROM personal",
			function (err, rows) {
				callback(rows);
			});
		  });
};
