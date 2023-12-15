Crafty.c("Gain", {
	_point: 1, // default
		
	gain: function(point) {
		this._point = point;
		return this;
	},
	
	hitGain: function() {
		var text = Crafty.e("2D, DOM, Text, Tween")
			.attr({w: 20, h: 20, w: 300, x: this.x, y: this.y, alpha: 2.0, z: 10})
			.css({fontFamily: 'SilkscreenNormal', fontSize: '26px', "text-align": "center", "color": "white"})			
			.tween({alpha: 0.0, y: this.y - 40}, 50)
			.bind("TweenEnd", function(e) {
				this.destroy();
			});
		text.text("+" + this._point);
		Crafty.trigger("PointReached", this._point);
	}
})