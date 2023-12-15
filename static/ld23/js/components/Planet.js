Crafty.c("Planet", {
	_to: -360,
	_speed: 0,
	_tweenVal: 0,
	
	init: function() {
		this.requires("2D");
		this._speed = 400;
		this.bind("EnterFrame", function(e) {
			// tween
			this.rotation += this._getTweenVal();
			if (this.rotation <= this._to) {
				this.rotation = 0;
			} else {
				this.trigger("revolution", this._tweenVal);
			}
		})
	},
	
	_getTweenVal: function() {
		return this._to / this._speed;
	}
	
	/*
	increaseSpeed: function() {
		this._setSpeed(40);
		//this._setSpeed((this._speed <= 40) ? 40: this._speed - 100);
		console.log("increaseSpeed", this._speed);
	},
	
	decreaseSpeed: function() {
		this._setSpeed((this._speed >= 400) ? 400: this._speed + 20);
		
		//console.log("decreaseSpeed", this._speed);
	}
	*/
});