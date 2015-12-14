module.exports = function calcula() {
    var fecha = new Date();
    return fecha.getFullYear() + "-" + cero((fecha.getMonth() + 1)) + "-" + cero(fecha.getDate());
}
function cero(date) {
    if (date < 10) {
        return ("0" + date);
    } else {
        return date;
    }
}
   
  