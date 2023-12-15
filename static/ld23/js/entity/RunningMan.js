function runningMan() {
	
	Crafty.bind("SpeedUp", function(e) {
		var ent = Entities['runningMan'];
		ent.speedRunning = (ent.speedRunning <= 4) ? ent.speedRunning : ent.speedRunning - 1;
	});
	
	Crafty.bind("SpeedDown", function(e) {
		var ent = Entities['runningMan'];
		ent.speedRunning = (ent.speedRunning >= 20) ? ent.speedRunning : ent.speedRunning + 1;
	});
	
	Entities['runningMan'] = Crafty.e(DISPLAY_COMPONENTS + ", Jumper, Man, SpriteAnimation")
		.attr({
			x: (Crafty.viewport.width / 2 - TILE_SIZE / 2), 
			y: HEIGHT - 120, 
			w: TILE_SIZE, 
			h: TILE_SIZE,
			speedRunning: 20,
			c: 0
		})
		// animation:
		.animate("running", 0, 0, 11)
		.animate("jumping", 9, 0, 9)
		
		.gravity("Ground", new Crafty.polygon([[17, 2],[47, 2],[47, 62],[17, 62]]))
		.jumper(5, 12)
		
		.bind("KeyDown", function(e) {
			if (this.isDown("ALT")) {
				//Crafty.trigger("SpeedUp");
			}
		})
		.bind("Moved", function(e) {
            Crafty.viewport.x = - this.x - this.w / 2 + Crafty.viewport.width / 2;
		})
		.bind("EnterFrame", function(e) {
			// y viewport
			if (this.y < 200) {
				Crafty.viewport.y = - this.y - this.h + Crafty.viewport.height / 2
			}

			// running loop:
			if (!this.isPlaying("running")) {
				this.animate("running", this.speedRunning, 1);
			}
		});
		
	Entities['runningMan'].addComponent("Collision")
		.collision(new Crafty.polygon([[17, 2],[47, 2],[47, 62],[17, 62]]))
		.onHit("Gain", function(e) {
			 e[0].obj.hitGain();
		});
};