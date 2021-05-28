document.createElement("article");
document.createElement("footer");
document.createElement("header");
document.createElement("hgroup");
document.createElement("nav");
document.createElement("aside");
document.createElement("section");

$(document).ready(function() {
     $('#navbtn').click(function() {
          $('ul.nav-menu').animate({ height: 'toggle'}, 300);
      });
});

$(document).ready(function() { 
//if ($(window).width() < 740) {
  $('ul.nav-menu').find('ul').parent().append('<span class="menuarrow"></span>');
  $(".menuarrow").click(function () {
		$(this).prev("ul").animate({ height: 'toggle'}, 300);
		//$(this).removeAttr("href");
		//return false;
		if ($(this).parent().hasClass('active')) {
      		$(this).parent().removeClass('active');
   		 } else {
      		$(this).parent().addClass('active');
    	} 
    });
//}
});


$(window).load(function () {
    width1 =  ($(".wrapper").width());
	var windowwith1 = $(window).width(), divWidth=0;
	var getwidth1 = ((windowwith1 - width1) / 2);
	$('.fullpage').css({'marginLeft':(-getwidth1)+'px'});
	$('.fullpage').css({'marginRight':(-getwidth1)+'px'});
	$('.fullpage-content').css({'marginLeft':(-getwidth1)+'px'});
	$('.fullpage-content').css({'marginRight':(-getwidth1)+'px'});
	$('.fullpage-content').css({'paddingLeft':(getwidth1)+'px'});
	$('.fullpage-content').css({'paddingRight':(getwidth1)+'px'});
});
var width = $(window).width();
$(window).resize(function(){
	width2 =  ($(".wrapper").width());
	var windowwith2 = $(window).width(), divWidth=0;
	var getwidth2 = ((windowwith2 - width2) / 2);
	$('.fullpage').css({'marginLeft':(-getwidth2)+'px'});
	$('.fullpage').css({'marginRight':(-getwidth2)+'px'});
	$('.fullpage-content').css({'marginLeft':(-getwidth2)+'px'});
	$('.fullpage-content').css({'marginRight':(-getwidth2)+'px'});
	$('.fullpage-content').css({'paddingLeft':(getwidth2)+'px'});
	$('.fullpage-content').css({'paddingRight':(getwidth2)+'px'});
});

$(window).load(function() {	
AOS.init({
	duration: 600,
	once: true,
});  
});

$(document).ready(function(){

$( "ul.tabs li:first-child, .tab-content:first-child" ).addClass('active');

	$('ul.tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.tabs li').removeClass('active');
		$('.tab-content').removeClass('active');

		$(this).addClass('active');
		$("#"+tab_id).addClass('active');
	})

})

function openModal() {
  document.getElementById("myModal").style.display = "block";
}

function closeModal() {
  document.getElementById("myModal").style.display = "none";
}


function openModal_1() {
  document.getElementById("myModal_1").style.display = "block";
}

function closeModal_1() {
  document.getElementById("myModal_1").style.display = "none";
}