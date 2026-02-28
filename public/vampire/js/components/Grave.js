Crafty.c("Grave", {	
	init: function() {
		this.addComponent("SpriteAnimation, Collision")
			.animate("burning", 3, 0, 9)
			.collision(new Crafty.polygon([15, 21],[33, 21],[33, 48],[15, 48]));
	}
});