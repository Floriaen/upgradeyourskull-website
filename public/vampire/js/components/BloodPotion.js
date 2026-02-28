Crafty.c("BloodPotion", {
	init: function() {
		this.requires("Collision")
			.collision(new Crafty.polygon([15, 21],[33, 21],[33, 48],[15, 48]));
	}
});