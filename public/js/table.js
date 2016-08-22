$(document).ready(function () {
  var table = $('#tabla').DataTable({
    columnDefs: [
      { orderable: false, targets: [10, 11] },

    ]
  });
  var table2 = $('#tabla2').DataTable({
    
  });
});