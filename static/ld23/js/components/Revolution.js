Crafty.c("Revolution", {
	_minSpeed: 500,
	
	_speedConst: 0.2,
	_decrease: false,
	_increase: false,
	
	_speedIncrease: 0,
	_speedDecrease: 0,
	
	init: function() {
		this.requires("Planet, Keyboard");
	},
	
	reset: function() {
		this._increase = false;
		this._speedIncrease = 0;
		this._speed = this._minSpeed;
	},
	
	revolution: function(min, max) {
		this.bind("EnterFrame", function(e) {
			if (this._decrease) {
				this._speedDecrease += this._speedConst;
				this._speed -= this._speedDecrease;
				this._speed += 10; // decrease
				
				if (this._speed <= this._minSpeed) {
					this.reset();
				}
			}
			
			if (this._increase) {
				this._speedIncrease += this._speedConst;
				this._speed += this._speedIncrease;
				this._speed -= 10;

				if (this._speed >= this._minSpeed) {
					this.reset();
				}
			}
		});
		
		this.bind("KeyDown", function(e) {
			if (this.isDown("LEFT_ARROW") && this._increase === false) {
				this._decrease = true;
			} else 
			if (this.isDown("RIGHT_ARROW") && this._decrease === false) {
				this._increase = true;
			}
		});
		
		return this;
	}
	
	
});