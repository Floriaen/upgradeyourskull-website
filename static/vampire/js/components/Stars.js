Crafty.c("Stars", {
	_stars: [],
	init: function() {
		var alpha = Crafty.math.randomInt(1, 8) / 10;
		var x = Crafty.math.randomInt(0, 20 * 48);
		var y = Crafty.math.randomInt(0, 20 * 48);
		Crafty.e("2D, DOM, Star, Color")
			.attr({x: x, y: y, w : 2, h: 2, alpha: alpha})
			.color("#FFFFFF");
	},

	draw: function() {
		var ctx = Crafty.canvas.context;
	}
})