var net = require('net');                   //lib de .net para el socket    
var fs = require('fs');                     //lib de escritura de archivos y carpetas
var ip = require('ip');
var config = require('./config.json');
var path = require('path');
var sqlite3 = require('sqlite3').verbose(); //lib de sqlite3
var Host;
if (config.ipAuto) {
    HOST = ip.address();
} else {
    HOST = config.ip;
}
var PORT = config.puerto;                           //pueto
net.createServer(function (sock) {          //crea server
    console.log('CONECTADO: ' + sock.remoteAddress + ':' + sock.remotePort);
    sock.on('data', function (data) {       //crea socket
        console.log('Datos Recibidos ' + sock.remoteAddress + ':\r\n' + data);
        var horaactual = calcula().toString();
        var add = 0;
        var res = data.toString().split(",");
        var comando = res[0], subcomando = res[1], id = res[2], cedula = res[3], nombre = res[4], apellido = res[5], fechanacimiento = res[6], fechaMarca_log = res[7], HoraMarca_log = res[8],
            TipoMarca = res[9], metodoMarca = res[10], empresa = res[11], subEmpresa = res[12], departamento = res[13], equipo = res[14], fechaactualizacion = res[15], acceso = res[16],
            Hab_keyb = res[17], huellac = res[18], observaciones = res[19], extra1 = res[20], extra2 = res[21], extra3 = res[22], extra4 = res[23], extra5 = res[24], Msg_rta = res[25], checksum = res[26];
        var long = 26;
        var send = "";
        var checksumCalculado = check(data, long);
        var checkmsg = "";
        var erasehash = checksum.split("#");
        var destDir = './database/' + empresa;
      
        if (!fs.existsSync(destDir)) {
            fs.mkdir(destDir);
        };
        var db = new sqlite3.Database(destDir + '/personal.db');            //creacion de la db de empleados
        var regdb = new sqlite3.Database(destDir + '/reg.db');              //db de reg
        fs.appendFile('./database/log.txt', horaactual + "," + data, function (err) {   //logs file
            if (err) {
                console.log('error');
            };
        });
        console.log(checksumCalculado + " " + erasehash[0]);
        if (checksumCalculado == erasehash[0]) {
        //    keepAlive = { "usuario": "user", "password": "123456" }
            if (comando === 'R' || comando === 'r') {  //registracion file
                regdb.serialize(function () {      //db table create and serialize
                    regdb.run('create table if not exists reg (id TEXT , fecha TEXT , hora TEXT , nombre TEXT , apellido TEXT , cedula TEXT ,empresa TEXT, subempresa TEXT , equipo TEXT ,marca TEXT ,mmark TEXT,acceso TEXT,observaciones TEXT )');
                });
                var insreg = regdb.prepare("INSERT INTO reg VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)");        //db var insert
                insreg.run(id, fechaMarca_log, HoraMarca_log, nombre, apellido, cedula, empresa, subEmpresa, equipo, TipoMarca, metodoMarca, acceso, observaciones);
                insreg.finalize();
                fs.appendFile(destDir + '/reg.txt', data, function (err) {
                    if (err) {
                        console.log('error');
                    };
                });
                send = "M,,,,,,,,,,,,,,,,,,,,,,,,,Aprobado,"
                checkmsg = check(send, long);
                sock.write(send + checkmsg + '#\r\n');
            }
            if (comando === 'E' || comando === 'e') {  //enroll files
                db.serialize(function () {      //db table create and serialize
                    db.run('create table if not exists personal (_id INTEGER PRIMARY KEY AUTOINCREMENT, fechaact TEXT , nombre TEXT , apellido TEXT , cedula TEXT , fechanac TEXT , subempresa TEXT , dpto TEXT , acceso TEXT ,habkyb TEXT , huellac TEXT )');
                });
                var borrar = db.prepare("DELETE FROM personal WHERE _id=(?)");
                borrar.run(id);
                borrar.finalize();
                fechaactualizacion = obtenerFecha().toString(); //reemplazo la fecha que me pasan por la que calculo
                var insertar = db.prepare("INSERT INTO personal VALUES (?,?,?,?,?,?,?,?,?,?,?)");        //db var insert
                insertar.run(id, fechaactualizacion, nombre, apellido, cedula, fechanacimiento, subEmpresa, departamento, acceso, Hab_keyb, huellac);
                insertar.finalize();
                fs.appendFile(destDir + '/enroll.txt', data, function (err) { //enroll
                    if (err) {
                        console.log('error');
                    };
                });
                send = "M,,,,,,,,,,,,,,,,,,,,,,,,,Aprobado,"
                checkmsg = check(send, long);
                sock.write(send + checkmsg + '#\r\n');
            };
            if (comando === 'A' || comando === 'a') {  //Actualizacion
                db.each("SELECT _id AS id,* FROM personal WHERE fechaact > $fechaaux",
                    { $fechaaux: fechaactualizacion },
                    function (err, row) {
                        send = "A,," + row._id + "," + row.cedula + "," + row.nombre + "," + row.apellido + "," + row.fechanac + ",,,,,," + row.subempresa + "," + row.dpto + ",," + row.fechaact + "," + row.acceso + "," + row.habkyb + "," + row.huellac + ",,,,,,,"
                        checksumCalculado = check(send, long);
                        console.log(send + "," + checksumCalculado + "#");
                        sock.write(send + "," + checksumCalculado + "#");
                    }, function (err, rows) {
                        if (rows == 0) {
                            console.log('Sin actualizacion');
                            send = "M,,,,,,,,,,,,,,,,,,,,,,,,,Sin Actualización,"
                            checkmsg = check(send, long);
                            sock.write(send + checkmsg + '#\r\n');
                        } else {
                            send = "M,,,,,,,,,,,,,,,,,,,,,,,,,Finalizado,"
                            checkmsg = check(send, long);
                            sock.write(send + checkmsg + '#\r\n');

                        }
                    });
            }
        } else {
            send = "M,,,,,,,,,,,,,,,,,,,,,,,,,Error Checksum,"
            checkmsg = check(send, long);
            sock.write(send + checkmsg + '#\r\n');
        }
    });
    sock.on('close', function (data) {
        console.log('Puerto Desconectado!!!\r\n');
    });
    sock.on('error', function (data) {
        console.log('Puerto Desconectado!!!\r\n');
    });
}).listen(PORT, HOST);
console.log('Server escuchando en ' + HOST + ':' + PORT);
//funciones 
function calcula() {
    var fecha = new Date();
    return fecha.getFullYear() + "/" + cero((fecha.getMonth() + 1)) + "/" + cero(fecha.getDate()) + "," + cero(fecha.getHours()) + ":" + cero(fecha.getMinutes()) + ":" + cero(fecha.getSeconds());
};
function obtenerFecha() {
    var fecha = new Date();
    var year = fecha.getFullYear();
    var part = (year.toString()).substr(2, 3);
    return part + cero((fecha.getMonth() + 1)) + cero(fecha.getDate()) + cero(fecha.getHours()) + cero(fecha.getMinutes()) + cero(fecha.getSeconds());
};
function cero(date) {
    if (date < 10) {
        return ("0" + date);
    } else {
        return date;
    };
};
function check(informacion, long) {
    var comacont = 0;
    var chk = 0;
    for (var i = 0; i < informacion.length; i++) {                 //suma para el checksum letra por letra
        add = informacion.toString().charCodeAt(i)
        if (add == 44) {
            comacont++
            //   console.log(comacont);
        };
        if (add >= 127 || comacont >= long) {             //omite caracteres incompatibles y checksum incluyendo ultima coma
            add = 0;
        };
        chk += add;
    };
    return chk
};


