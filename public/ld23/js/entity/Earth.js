function earth() {

	var ground = Crafty.e(DISPLAY_COMPONENTS + ", Ground")
		.attr({x: 0, y: HEIGHT - 120, w: WIDTH, h: 10});

	Entities['earth'] = Crafty.e(DISPLAY_COMPONENTS + ", Tween, Earth, Revolution, SatelliteFactory")
		.attr({x: 0, y: 400, w: 800, h: 800, c: Crafty.frame()})
		.origin("center")
		.revolution(0, 0)
		.bind("revolution", function(e) {
			_.each(this._satellites, function(satellite) {
				satellite.move(e);
			});
		})	
		.bind("EnterFrame", function(e) {
			if ((Crafty.frame() - this.c) % 10 === 0) { // tic
				this.c = Crafty.frame();

			//	var angle = Crafty.math.randomInt(0, 360);
				// 416 initial man y position			
				
				var topRange = Crafty.math.randomInt(300, 400)
				var height = Crafty.math.randomInt(-200, topRange); // range
				var diff = ((416) - Entities['runningMan'].y);
				var dist = 340 + diff + height;
				dist = (dist < 416) ? 416 : dist;

				this.createSatellite("Fish", dist);
			}
		})
};