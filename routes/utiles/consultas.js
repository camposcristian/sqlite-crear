module.exports = function select(callback) {
	var sqlite3 = require('sqlite3').verbose();
	if (typeof localStorage === "undefined" || localStorage === null) {
		var LocalStorage = require('node-localstorage').LocalStorage;
		localStorage = new LocalStorage('./scratch');
	};
	var user = localStorage.getItem('user');
	var ruta = "./database/" + user + "/personal.db";
	var db = new sqlite3.Database(ruta);
	db.serialize(function () {
		db.run('create table if not exists personal (_id INTEGER PRIMARY KEY AUTOINCREMENT, idusuario TEXT , nombre TEXT , apellido TEXT , cedula TEXT , fechanac TEXT , empresa TEXT , dpto TEXT , acceso TEXT , huella TEXT )');
		db.all("SELECT _id AS id,* FROM personal",
			function (err, rows) {
				callback(rows);
			});
		  });
};

   
 