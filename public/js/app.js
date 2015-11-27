	
	

$(document).ready(function() {

	/* Tabs Activiation
	================================================== */
	var tabs = $('ul.tabs'),
	    tabsContent = $('ul.tabs-content');
	
	tabs.each(function(i) {
		//Get all tabs
		var tab = $(this).find('> li > a');
		tab.click(function(e) {
			
			//Get Location of tab's content
			var contentLocation = $(this).attr('href') + "Tab";
			
			//Let go if not a hashed one
			if(contentLocation.charAt(0)=="#") {
			
				e.preventDefault();
			
				//Make Tab Active
				tab.removeClass('active');
				$(this).addClass('active');
				
				//Show Tab Content
				$(contentLocation).show().siblings().hide();
				
			} 
		});
	}); 
	
	$('.imag').mouseenter(function(){			 		
 		$('.imag').height('99%');		
 		$('.imag').width('250px');
	    $('<br><br><br><br><br><ul><li><input type="submit" name="buscar" id="buscar" value="Exportar por Fecha" class="enlace" /><br><br><br><li><input type="submit" name="nuevo" id="nuevo" value="Agregar Nuevo Empleado" class="enlace" /></ul>').appendTo('.info');
		 
	});
	$('.imag').mouseleave(function(){	 
 		$('.imag').height('45px');		
 		$('.imag').width('140px')	
		$('.info').empty()
	});
	$(".informe2").animate({
   'width':'350px'
	})
	 $(".informe2").animate({
   'height':'40pt'
},1000)
 
 setTimeout(function() {
  $(".informetext").animate({
   'font-size': '12pt'
})},1000)
 
 setTimeout(function() {
	 $(".informetext").animate({
	 'font-size': '0pt'
 },3000)},6000)
 
setTimeout(function() {
	 $(".informetext").hide()
},7000)

setTimeout(function() {
	 $(".informe2").animate({
   'height':'5pt'
},1000)},6000);

 setTimeout(function() {
$(".informe2").animate({
   'width':'0pt'
	})
 },6000)
	
});