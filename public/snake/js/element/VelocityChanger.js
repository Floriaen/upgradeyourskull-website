Crafty.c('VelocityChanger', {
	
	changeVelocity: function(speed) {
		this.alpha = 0.5;
		var w = Crafty("Worm");
		var oldSpeed = w._speed;
		w.setSpeed(speed);
	}
	
});