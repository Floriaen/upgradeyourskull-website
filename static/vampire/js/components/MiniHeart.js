Crafty.c("MiniHeart", {
	init: function() {
		this.requires("BloodPotion, SpriteAnimation")
			.animate("beat", 0, 0, 2) 
			.animate("beat", 15, -1)
	}
});