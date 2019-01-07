
class  VideoPlayers{
  constructor () {
	  this.video_players = [];
  }

}

class  DropboxVideo{
  constructor (fileid, start, width, float_pos) {
    this.fileid = fileid; // instance variables
    this.start = start;
    this.width = width;
	  this.float_off = 0;
    this.float_pos = float_pos;
	this.seek_pos = start;
	this.targetseek_pos = start;
	this.frozen = true;
	this.hover = false;
	this.moving = false;
	this.accelamount = 0.3; 
	this.load_params();
  }
	load_params () {
		this.surround_div = document.getElementById("surround"+ this.fileid);
		this.time = document.getElementById("time"+ this.fileid);
		this.video = document.getElementById("video"+this.fileid);
		this.video.pause();

		this.video.addEventListener( "loadedmetadata", function (e) {
			var inv_asp_ratio = this.video.videoHeight/this.video.videoWidth;
			this.video.width = this.width,
			this.video.height = this.width*inv_asp_ratio;
			this.time.style.top = this.video.height + 3 + 'px';
			  this.video.currentTime = this.seek_pos;
		}.bind(this), false );

	  if (this.float_pos == "right" ) {
			this.surround_div.style.cssFloat = "right";
			this.surround_div.style.maxWidth = this.width;
			this.surround_div.style.margin = "5px 20px 20px";
	  }
	  else if (this.float_pos == "left" ) {
			this.surround_div.style.cssFloat = "left";
			this.surround_div.style.maxWidth = this.width;
			this.surround_div.style.margin = "5px 20px 20px";
	  }
	  else if (this.float_pos == "center" ) {
			this.surround_div.style.cssFloat = "none";
			this.surround_div.style.maxWidth = this.width;
			this.surround_div.style.margin = "5px auto 20px";
			this.time.style.margin = "0px auto 0px";
			this.float_off = -this.width/2;
	  }
	}

	start_animation() {
		this.motion = window.setInterval(function(){  
				
			  //Accelerate towards the target:
			  this.seek_pos += (this.targetseek_pos - this.seek_pos)*this.accelamount;
			this.moving = (Math.abs((this.targetseek_pos- this.seek_pos)/this.video.duration) > 0.001);
			if (this.moving) {
			  this.time.style.backgroundColor ="rgba(0, 0, 0, 0.4)";
				this.video.style.borderBottomColor ="rgba(0, 0, 0, 0.1)";
			}
			else {
				if (this.hover==false) {
			  this.time.style.backgroundColor ="rgba(0, 0, 0, 0.0)";
				this.video.style.borderBottomColor ="rgba(0, 0, 0, 0.0)";
				}
			}
		  
			  //update video playback
			  this.video.currentTime = this.seek_pos;
			  this.time.style.left = (this.float_off) -2 + (this.video.width *(this.seek_pos / this.video.duration)) + 'px';
			  this.video.pause();
			
		}.bind(this), 80);

	}

	stop_animation() {
		window.clearInterval(this.motion);
	}


  static fromElement(element) { // class method
    const bounds = element.getBoundingClientRect();
    return new Rectangle(bounds.left, bounds.top, bounds.width, bounds.height);
  }
}


var video_players = new VideoPlayers();