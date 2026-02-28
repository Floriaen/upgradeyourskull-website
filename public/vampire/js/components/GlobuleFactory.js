Crafty.c("GlobuleFactory", {
	_globuleCount: 0,
	_globules: [],
	
	init: function() {
		
	},
	
	generate: function(globuleCount) {
		this._globuleCount = globuleCount;
		var gen = function() {
			if (Crafty.frame() % 10 === 0) {
				if (this._globuleCount > 0) {
					this._globuleCount--;
					var globule = this._getGlobule();
					this._initGlobule(globule);
					this._globules.push(globule);
					
				} else {
					this.unbind("EnterFrame", gen);
				}	
			}
		};
		this.bind("EnterFrame", gen);
	},
	
	_initGlobule: function(globule) {
		// define a random angle:
		var angle = Crafty.math.randomInt(0, 180);
		angle = Crafty.math.degToRad(angle);
		
		// set a random speed (dX, dY)
		var randomOffset = Math.random() * 1 - .5;
		var speed = Math.random() * 15 + 3; // random speed

		globule.x = Crafty.viewport.width / 2;
		globule.y = 10;

		globule._dX = speed * Math.cos(angle + randomOffset);
		globule._dY = speed * Math.sin(angle + randomOffset);
		
		globule._goalX = null;
		globule._goalY = null;

		return globule;
	},
	
	_getGlobule: function() {
		var self = this;
		return Crafty.e("2D, DOM, Color, Globule")
			.attr({x: 0, y: 0, w: 10, h: 10})
			.color("red")
			.bind("PointReached", function() {
				self._initGlobule(this);
			});
	}
})