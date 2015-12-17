module.exports = function calcula() {
    var fecha = new Date();
    return fecha.getFullYear() + "-" + agregarCero((fecha.getMonth() + 1)) + "-" + agregarCero(fecha.getDate());
}
function agregarCero(date) {
    if (date < 10) {
        return ("0" + date);
    } else {
        return date;
    }
}
   
  