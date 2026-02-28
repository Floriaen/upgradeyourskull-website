Crafty.c("Globule", {
	
	_dX: 0, //Crafty.math.randomInt(2, 10),
    _dY: 0, //Crafty.math.randomInt(2, 20),

	_acc: 0,

	_goalX: null,
	_goalY: null,

	init: function() {
		
		this.requires("2D");
		this.bind("EnterFrame", function(e) {
			if (this.y <= 0 || this.y >= Crafty.viewport.height - this.h) {
				this._dY *= -1;
				this._acc = 0;
			}
		    if (this.x <= 0 || this.x >= Crafty.viewport.width - this.w) {
				this._dX *= -1;
				this._acc = 0;
			}
			
			this._acc += 0.0005;
		
			var vx = this._dX + this._acc;
			var vy = this._dY + this._acc;
			
			this.x += vx;
		   	this.y += vy;

			if (this._goalX && this._goalY) {
				
				// var intersect = this.intersect(
				// 					this._goalX - vx, 
				// 					this._goalY - vy, 
				// 					(this._dX + vx) * 2, 
				// 					(this._dY + vy) * 2
				// 				);
				// 				
			
				var intersect = this.intersect(
									this._goalX - 20, 
									this._goalY - 20, 
									40,
									40
								);

				if (intersect) {
					Crafty.e("2D, DOM, Color")
						.attr({
							x: this._goalX - 20, 
							y: this._goalY - 20, 
							w: 40,
							h: 40,
							z: 0
						})
						.color("Yellow");
					
					this.trigger("PointReached");
				}
			}
		
		})
	},
	
	goTo: function(x, y) {
		var diffX = x - this.x;
		var diffY = y - this.y;
		this._dX = diffX / 10;
		this._dY = diffY / 10;
		
		if (this._dX === 0) {
			this._dX += 0.1;
		}
		if (this._dY === 0) {
			this._dY += 0.1;
		}
		
		this._goalX = x;
		this._goalY = y;
	}
	/*
	applyVector: function(vector) {
		
		this._memory.dX = this._dX;
		this._memory.dY = this._dY;
		
		this._dX = vector.x;
		this._dX = vector.y;
	}
	*/
});