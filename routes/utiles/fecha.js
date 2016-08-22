module.exports = function calcula() {
    var fecha = new Date();
    var year = fecha.getFullYear();
    var part = (year.toString()).substr(2, 3);
    return part + agregarCero((fecha.getMonth() + 1)) + agregarCero(fecha.getDate()) + agregarCero(fecha.getHours()) + agregarCero(fecha.getMinutes()) + agregarCero(fecha.getSeconds());
}
function agregarCero(date) {
    if (date < 10) {
        return ("0" + date);
    } else {
        return date;
    }
}

