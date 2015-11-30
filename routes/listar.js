var express = require('express');
var ejs=require('ejs');
var router = express();
var sqlite3 = require('sqlite3').verbose();
var login = new sqlite3.Database('./database/Usuarios.sqlite');
var fecha = require('./fecha.js');
var fs = require('fs');
var database = [];
var nombre2 = "";
var pjson = require('../package.json');
var i = 0;
var c=0;
var x = 0;
var hasta2="";
var max = 0;
router.post('/', function (req, res) {
if (req.body.iniciar === 'Iniciar') {
	if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
};
		localStorage.setItem('password',req.body.password);
		localStorage.setItem('user',req.body.user);
	}
	var user=localStorage.getItem('user');
	var password=localStorage.getItem('password');
	nombre2="Bienvenido "+user;
login.serialize(function () {
	login.each("SELECT rowid AS rowid,* FROM users WHERE user = $useraux",
	{ $useraux: user },
		function (err, row) {
			if (row.user===user){
			if (row.password===password){
				validado();
			}else{
				novalidado();
			}
			}
		},function(err,rows){
				if (rows===0){
					novalidado();
				}
			})
});
function validado(){
	var ruta="./database/"+user+"/personal.db"
	if (ruta==="./database/null/personal.db"){
		novalidado();
	};
    if (ruta!="./database/null/personal.db"){
	var db = new sqlite3.Database(ruta);
	function select(callback){
	db.serialize(function () {
		db.run('create table if not exists personal (_id INTEGER PRIMARY KEY AUTOINCREMENT, idusuario TEXT , nombre TEXT , apellido TEXT , cedula TEXT , fechanac TEXT , empresa TEXT , dpto TEXT , acceso TEXT , huella TEXT )');
		db.all("SELECT _id AS id,* FROM personal",
			function (err, rows) {
database=rows;
max = (database.length);
callback();
			});
		x = 0;	
	})
	}
	var nombre = req.body.username;
	var apellido = req.body.apellido;
	var id = req.body.id;
	var idusu = fecha().toString();
	var ci = req.body.ci;
	var fechanac = req.body.nac;
	var empresa = req.body.empresa;
	var dpto = req.body.dpto;
	var acceso = boleano(req.body.acceso);
	var huella;
if (req.body.cancelar === 'Cancelar') {
	nombre2="Operacion Cancelada";
}
	if (req.body.Exportar === 'Exportar') {
		var desde = req.body.desde;
		var hasta = req.body.hasta;
		if (desde>hasta){
			nombre2="Fecha inicial no puede ser mayor que fecha final";
		};	
		function suma1(){
			var dates=new Date(hasta);
			return dates.getFullYear() + "-" + cero((dates.getMonth() + 1)) + "-" + cero((dates.getDate() +1));		
		};
		if (hasta>=desde && req.body.formato==="txt"){
			 hasta2=suma1(hasta);
			c=0;
			var ruta2="./database/"+user+"/database.txt";
	 for (var x = 0; x < max; x++){
		 if(database[x].idusuario>=desde && hasta2>=database[x].idusuario){
			 c=c+1;	 
	fs.appendFile(ruta2,database[x]._id+","+database[x].idusuario+","+database[x].nombre+","+database[x].apellido+","+database[x].cedula+","+database[x].fechanac+","+database[x].empresa+","+database[x].dpto+","+database[x].acceso+","+database[x].huella+'\r\n', function (err) {
    if (err) {
    c=0;
    console.log('error');
        }});	 
		 }};  
		 nombre2=c+" Dato(s) exportados en .Txt";
		 };
			 if(hasta>=desde && req.body.formato==="Db"){ 
				 hasta2=suma1(hasta);
			  c=0;
			  var ruta3="./database/"+user+"/exportados.db";
			  var exporta = new sqlite3.Database(ruta3);
			   exporta.serialize(function () {
			   exporta.run('drop table if exists personal');
			   exporta.run('create table if not exists personal (_id INTEGER PRIMARY KEY AUTOINCREMENT, idusuario TEXT , nombre TEXT , apellido TEXT , cedula TEXT , fechanac TEXT , empresa TEXT , dpto TEXT , acceso TEXT , huella TEXT )');
			   var insertar = exporta.prepare("INSERT INTO personal VALUES (?,?,?,?,?,?,?,?,?,?)");
			   for (var x = 0; x < max; x++){
		    if(database[x].idusuario>=desde && hasta2>=database[x].idusuario){
		     c=c+1;
			insertar.run(database[x]._id,database[x].idusuario,database[x].nombre, database[x].apellido, database[x].cedula, database[x].fechanac, database[x].empresa, database[x].dpto,database[x].acceso,database[x].huella);
		 };    
			   } insertar.finalize();
			    nombre2=c+" Dato(s) exportados en .Db"; 			   
			    });
			 };
		x = 0;
		max = 0;
	};	
	if (req.body.grabar === 'Grabar') {
		console.log('grabar');
		db.each("SELECT _id AS _id,huella FROM personal WHERE _id = $useraux",
	{ $useraux: id },
		function (err, row) {
			huella=row.huella;
			},function (err,rows){
				if(rows!=0){
					insert();
				};
			});
			function insert(){
			var borrar = db.prepare("DELETE FROM personal WHERE _id=(?)");
			borrar.run(id);
			borrar.finalize();
			if (huella==="Sin Enrolar"||huella===null){
				huella="Sin Enrolar";
			}
			var insertar = db.prepare("INSERT INTO personal VALUES (?,?,?,?,?,?,?,?,?,?)");
			insertar.run(id, idusu, nombre, apellido, ci, fechanac, empresa, dpto, acceso, huella);
			insertar.finalize();
			nombre2 = "Usuario" + " " + nombre + " " + apellido + " " + "Actualizado"
			}
		};
		if (req.body.borrar === 'Eliminar') {
			console.log('borrar');
			var borrar = db.prepare("DELETE FROM personal WHERE _id=(?)");
			borrar.run(id);
			borrar.finalize();
			nombre2 = "Usuario" + " " + nombre + " " + apellido + " " + "Eliminado";
		};
	select(function(){		
	res.render(__dirname + '/../views/Listaempleados', { vector: database, max: max, nombre2: nombre2,version:pjson.version,fecha:fecha()});
nombre2="";
});
};
};
function novalidado(){
router.engine('html', ejs.__express);
res.render('index.html',{title:"Usuario o contraseña no valida, intente nuevamente"});
};
});
 function cero(date) {
        if (date < 10) {
            return ("0" + date);
        }
        else {
            return date;
        };
    };

function boleano(valor) {
	if (valor === "on") {
		return ("true");
	}
	else {
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
module.exports = router;

