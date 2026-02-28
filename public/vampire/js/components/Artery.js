Crafty.c("Artery", {
	init: function() {
		this.requires("Keyboard, GlobuleFactory");
		this.bind("KeyDown", function(e) {
			var self = this;
			var rect = {x: 100, y:25, w: 100, h: 400};
			var w = this.w, h = this.h;
			_.each(this._globules, function(globule) {
				if (globule.intersect(rect.x, rect.y, rect.w, rect.h)) {
					// update
					globule.goTo(w / 2, h - 10);
				}
			});
		})
	},
	
	createGlobules: function() {
		this.generate(20);
	}
});