//Fade top navbar upon scroll
$(document).ready(function(){
	var $window = $(window);
	//Fade and shrink stuff	
	$(window).scroll(function() {
		var y = $window.scrollTop() / 75; 
		var titleFade = 1 - y/.85;
		if($(window).scrollTop()<=65){
			$('.blog-author').css("opacity",titleFade);
			$('.blog-title').css("opacity",titleFade);	
			if($(window).scrollTop()>=54){
				var navdrop = Math.min(77,69 + ($(window).scrollTop()-54));
				$('.blog-nav').css("top",navdrop+"px");
				// console.log(navdrop);
			}
		}else{
			var nameFade = ($window.scrollTop()-65)/20;
			nameFade = Math.min(1,nameFade);
			$('.blog-author').css("opacity",nameFade);
			$('.blog-title').css("opacity",nameFade);
		}
	});
});
		  
//Pin navbar
$(window).scroll(function(){
	if($(window).scrollTop()>65){
		$('.blog-title-wrap').css("height","45px");
		$('#site-head').css("position","fixed");
		$('div.navbar-padding').css("height","130px");
		$('.blog-title').css("font-size","30px");
		$('.blog-title').css("left","5px");
		$('.blog-author').css("top","12px");
		$('.blog-author').css("left","330px");
		$('.blog-author').css("font-size","20px");	
		$('.blog-author').css("position","absolute");		
		$('.blog-nav').css("top","12px");
	}else{	
		$('.blog-title-wrap').css("height","");
		$('#site-head').css("position","");
		$('div.navbar-padding').css("height","");
		$('.blog-title').css("font-size","");
		$('.blog-author').css("font-size","");
		$('.blog-author').css("top","");
		$('.blog-author').css("left","");
		$('.blog-title').css("left","");
		$('.blog-nav').css("top","");
	}
});

//Creates figure captions under images
$(document).ready(function() {
	// Every image referenced from a Markdown document
	$(".post-content img").each(function() {
		// Let's put a caption if there is one
		if($(this).attr("alt"))
			$(this).wrap('<div class="image"></div>')
				.after('<div class="figcaption">'+$(this).attr("alt")+'</div>');
		});
});


window.onload = function() {
	var v_length = this.video_players.length;
	for (var i = 0; i < v_length; i++) {
		this.video_players[i].video.addEventListener('mousemove', function(event) {
			if (!this.frozen && !this.mobile) {
			this.targetseek_pos = this.video.duration * (event.offsetX/this.width);
			}
		}.bind(this.video_players[i]) );

		this.video_players[i].video.addEventListener('click', function(event) {
			if (!this.mobile) {
			this.frozen = !this.frozen;
			this.targetseek_pos = this.video.duration * (event.offsetX/this.width);
			}
		}.bind(this.video_players[i]));

		this.video_players[i].video.addEventListener('mouseenter', function(event) {
			trigger_animation_switch(this);
			this.time.style.backgroundColor ="rgba(0, 0, 0, 0.4)";
			this.video.style.borderBottomColor ="rgba(0, 0, 0, 0.1)";
			this.hover = true;
		}.bind(this.video_players[i]));

		this.video_players[i].video.addEventListener('mouseout', function(event) {
			if (!this.moving) {
			this.time.style.backgroundColor ="rgba(0, 0, 0, 0.0)";
			this.video.style.borderBottomColor ="rgba(0, 0, 0, 0.0)";
			}
			this.hover = false;
		}.bind(this.video_players[i]));

		this.video_players[i].video.addEventListener('touchmove', function(event) {
			// Calculate the slider value
			if (!this.frozen) {
				if (this.float_off == 0) {
					console.log("gere");
			this.targetseek_pos = this.video.duration * 
				((event.touches[0].pageX - this.rect.left)/this.width);
			}
				else {
			this.targetseek_pos = this.video.duration * 
				((event.touches[0].pageX - ((window.innerWidth/2)-(this.width/2)))/this.width);
				}
			}
		}.bind(this.video_players[i]), {passive: true});

		this.video_players[i].video.addEventListener('touchstart', function(event) {
			this.mobile=true;
			this.time.style.backgroundColor ="rgba(0, 0, 0, 0.4)";
			this.video.style.borderBottomColor ="rgba(0, 0, 0, 0.1)";
			this.hover = true;
				if (this.float_off == 0) {
					console.log("here");
			this.touch_seek = this.video.duration * 
				((event.touches[0].pageX - this.rect.left)/this.width);
			}
				else {
			this.touch_seek = this.video.duration * 
				((event.touches[0].pageX - ((window.innerWidth/2)-(this.width/2)))/this.width);
				}
			this.touch_time = new Date();
		}.bind(this.video_players[i]), {passive: true});

		this.video_players[i].video.addEventListener('touchend', function(event) {
			if (!this.moving) {
			this.time.style.backgroundColor ="rgba(0, 0, 0, 0.0)";
			this.video.style.borderBottomColor ="rgba(0, 0, 0, 0.0)";
			}
			if ((new Date() - this.touch_time) < 200) {
					console.log("here tap");
				this.frozen = !this.frozen;
				this.targetseek_pos = this.touch_seek;
			}
			this.hover = false;
		}.bind(this.video_players[i]) , {passive: true});
		
	}
}.bind(video_players)


var trigger_animation_switch = function(player) {
	var v_length = this.video_players.length;
	for (var i = 0; i < v_length; i++) {
		this.video_players[i].stop_animation()
	}
	player.start_animation();
	
}.bind(video_players)