Crafty.c("Plateformer", {
	init: function() {
		
	},

	plateform: function(componentName) {
		this.requires("Collision");
		this.bind("EnterFrame", function() {
			var collision = this.hit(componentName);
			if (collision) {
				var i = 0, l = collision.length;
				var dx = 0, dy = 0;
				for (i; i < l; i++) {
					//var plateform = collision[i].obj;
					
					this.x -= this._movement.x;
					this.y -= this._movement.y;
				}
			}
		});
		return this;
	}

})