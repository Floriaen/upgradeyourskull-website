Crafty.c("Block", {
	init: function() {
		this.requires("Collision").collision(new Crafty.polygon([0, 0],[48, 0],[48, 48],[0, 48]));
	}
})