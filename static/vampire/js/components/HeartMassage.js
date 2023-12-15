Crafty.c("HeartMassage", {
	_heart: null,
	_beginMassage: false,
	init: function() {
		
		// this.requires("Color");
		// 		this.color("#40271d");
		
		this._heart = Crafty.e("2D, DOM, SpriteAnimation, HeartSprite, Heart").attr({
			x: (Crafty.viewport.width - 100) / 2 , 
			y: (Crafty.viewport.height - 150) / 2
		})
		.animate("beat", 0, 0, 2)
		.bind("Reveal", function() {
			if (!this.isPlaying("beat")) {
				this.stop().animate("beat", 15, 3);
			}
		})
		.bind("Reanimate", function() {
			this._beginMassage = false;
			if (this.isPlaying("beat")) {
				this.stop();
			}
			console.log("Sprite animation");
			this.animate("beat", 15, -1);
		});
		
		
		this.requires("KeyBoard");
		this.bind("KeyDown", function() {
			this._beginMassage = true;
			console.log("beginMassage");
		});
	
		this.bind("KeyUp", function() {
			this._beginMassage = false;
			
			//this._heart
		});
		
		this.bind("EnterFrame", function() {
			if (this._beginMassage === true) {
				if (Crafty.frame() % 100 === 0) {
					this._heart.reanimate();
				}
			}
		});
		
	},
	
	massage: function() {
		
	},	
});