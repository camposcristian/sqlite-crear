var express = require('express');
var router = express();
var i = 0;
var hasta2 = "";
var fs = require('fs');
var database;
var nombre2 = "";
var c = 0;
var pjson = require('../package.json');
var sqlite3 = require('sqlite3').verbose();
var max = 0;
var obtenerFecha = require('./utiles/fecha.js');
var PDFDocument = require('pdfkit');
var nodeExcel = require('excel-export');
var blobStream = require('blob-stream');
var lorem = require('lorem-ipsum');
var iframe = require('iframe')
var obtenerReg = require('./utiles/consultasreg.js');
router.get('/', function (req, res) {
	var idEmpresa = req.user.idEmpresa;
	var ruta = "./database/" + idEmpresa + "/reg.db";
	if (ruta === "./database/null/reg.db") {
		res.redirect('/');
	} else {
		res.render(__dirname + '/../views/exportaremp', { fecha: obtenerFecha() });
	};
});
router.post('/', function (req, res) {
	var conf = {};
	//	conf.stylesXmlFile = "styles.xml";
    conf.name = "mysheet";
	conf.cols = [{
		caption: 'Nombre y Apellido',
        type: 'string'
	}, {
			caption: 'fecha',
			type: 'string'
		}, {
			caption: 'Entrada',
			type: 'string'
		}, {
			caption: 'Inicio Almuerzo',
			type: 'string'
		}, {
			caption: 'Inicio Almuerzo',
			type: 'string'
		}, {
			caption: 'Inicio Almuerzo',
			type: 'string'
		}];
	conf.rows = [];
	var doc = new PDFDocument();
	var desde = parseInt((req.body.desde).replace(/-/g, ''));
	var hasta = parseInt((req.body.hasta).replace(/-/g, ''));
	if (desde > hasta) {
		errorDate = "Fecha inicial no puede ser mayor que fecha final";
		res.render(__dirname + '/../views/exportaremp', { fecha: obtenerFecha(), errorDate: errorDate });
	} else {
		doc.fontSize(8).text('Registraciones desde:' + desde + ",hasta:" + hasta, 200, 20);
		var idEmpresa = req.user.idEmpresa;
		//var admin = req.user.admin;
		var ruta = "./database/" + idEmpresa + "/reg.db";
		var fechavalida = [];
		var ordenado = [];
		if (hasta >= desde && req.body.orden === "empleado") {
			obtenerReg(function (database) {
				database.forEach(function (item) {
					var fechamark = parseInt((item.fecha).replace(/-/g, ''));
					if (fechamark >= desde && fechamark <= hasta) {
						console.log(item);
						fechavalida.push(item);
					}
				});
				fechavalida.forEach(function (element) {
					console.log(element);
					if (!ordenado[element.id]) {
						ordenado[element.id] = element.nombre + " " + element.apellido + ";";
					}
					ordenado[element.id] = ordenado[element.id] + element.fecha + "," + element.hora + "," + element.marca + "#";
				});

				var linea = 60;
				ordenado.forEach(function (cadauser) {
					var separadopunto = cadauser.split(";");
					doc.fontSize(12).text(separadopunto[0] + ":", 80, linea);		//Nombre y apellido
					conf.rows.push(
						separadopunto[0]
					);
					var separadohash = separadopunto[1].split("#");
					var fechaaux = "";
					separadohash.forEach(function (cadareg) {
						var separadocoma = cadareg.split(",");
						if (fechaaux != separadocoma[0]) {
							fechaaux = separadocoma[0];
							linea = linea + 10;
							doc.fontSize(11).text(separadocoma[0], 180, linea);
						};
						if (separadocoma[2] === '1') {
							var columna = 260
						};
						if (separadocoma[2] === '8') {
							var columna = 330
						};
						if (separadocoma[1]) {
							doc.fontSize(10).text(separadocoma[1], columna, linea);
						}
					});
					linea = linea + 20;
				});
				if(req.body.formato==="pdf"){
				res.contentType("application/pdf");
				doc.pipe(res);
				doc.end();
				}else{
				var result = nodeExcel.execute(conf);
				res.setHeader('Content-Type', 'application/vnd.openxmlformats');
				res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
				res.end(result, 'binary');
				}
			}, ruta);
		};
		if (hasta >= desde && req.body.orden === "fecha") {
		};
	};

	//	function obtenerSuma(){
	//		var dates=new Date(hasta);
	//		return dates.getFullYear() + "-" + agregarCero((dates.getMonth() + 1)) + "-" + agregarCero((dates.getDate()));		
	//	};
	//	if (hasta>=desde && req.body.formato==="txt"){
	//		 hasta2=obtenerSuma(hasta);
	//		c=0;
	//		var user=req.user.idEmpresa;
	//		var ruta2="./database/"+user+"/database.txt";
	// for (var x = 0; x < max; x++){
	//	 if(database[x].idusuario>=desde && hasta2>=database[x].idusuario){
	//	 c=c+1;	 
	//fs.appendFile(ruta2,database[x]._id+","+database[x].idusuario+","+database[x].nombre+","+database[x].apellido+","+database[x].cedula+","+database[x].fechanac+","+database[x].empresa+","+database[x].dpto+","+database[x].acceso+","+database[x].huellac+'\r\n', function (err) {
    //if (err) {
    //c=0;
    //console.log('error');
    //    }});	 
	//	 }};  
	//	 nombre2=c+" Dato(s) exportados en .Txt";
	//	 x = 0;
	//	 };
	//		 if(hasta>=desde && req.body.formato==="Db"){ 
	//		  c=0;
	//		  hasta2=obtenerSuma(hasta);
	//		  var user=req.user.idEmpresa;
	//		  var ruta3="./database/"+user+"/exportados.db";
	//		  var exporta = new sqlite3.Database(ruta3);
	//		   exporta.serialize(function () {
	//		   exporta.run('drop table if exists reg');
	//		   exporta.run('create table if not exists reg (_id INTEGER PRIMARY KEY AUTOINCREMENT, idusuario TEXT , nombre TEXT , apellido TEXT , cedula TEXT , fechanac TEXT , empresa TEXT , dpto TEXT , acceso TEXT , huellac TEXT )');
	//		   var insertar = exporta.prepare("INSERT INTO reg VALUES (?,?,?,?,?,?,?,?,?,?)");
	//		   for (var x = 0; x < max; x++){
	//	    if(database[x].idusuario>=desde && hasta2>=database[x].idusuario){
	//	     c=c+1;
	//		insertar.run(database[x]._id,database[x].idusuario,database[x].nombre, database[x].apellido, database[x].cedula, database[x].fechanac, database[x].empresa, database[x].dpto,database[x].acceso,database[x].huellac);
	//	 };    
	//		   };
	//		   insertar.finalize();
	//		    nombre2=c+" Dato(s) exportados en .Db"; 			   
	//		    });
	//		 };
	//res.render(__dirname + '/../views/listaemp', {vector:database,max:max,nombre2:nombre2,version: pjson.version,user:user,admin:admin});
	//nombre2="";	
	//},ruta);
});

function agregarCero(date) {
	if (date < 10) {
		return ("0" + date);
	} else {
		return date;
	};
};

module.exports = router;