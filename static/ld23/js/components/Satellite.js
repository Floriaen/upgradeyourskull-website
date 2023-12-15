Crafty.c("Satellite", {
	_toRad: (Math.PI / 180),
	_toDeg: (180 / Math.PI),
	_dir: 1,
	
	_gravityOrigin: {x: 0, y: 0},
	_angle: 45,
	
	reset: function() {
		this._angle = 45;
		this._dir = Crafty.math.randomInt(0, 1) === 1 ? -1: 1;
	},
	
	fix: function(origin, distance, angle) {
		this.reset();
		this._gravityOrigin = origin;
		this._distance = distance;
		this.move(angle);
		
		return this;
	},
	
	move: function(speed) {
		this.requires("2D").origin("center");

		var d = this._distance;
		this._angle -= 0.02 + (1 / d * 2); 		
		
		this.rotation = (this._angle + (Math.PI / 2)) * this._toDeg;
		
		this.x = Math.cos(this._angle) * d + this._gravityOrigin.x - this.w / 2;
		this.y = Math.sin(this._angle) * d + this._gravityOrigin.y - this.h / 2;
		
		return this;
	}
	
});