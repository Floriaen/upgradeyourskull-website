Crafty.c("SatelliteFactory", {
	MAX_SATELLITE: 40,
	_satellites: [],

	getTheFirstHiddenSatellite: function() {
		var self = this;
		return _.find(this._satellites, function(satellite) {
			return !Crafty.DrawManager.onScreen(satellite)
		});
	},
	
	createSatellite: function(name, distance) {
		//console.log("#createSatellite", name, distance);
		var satellite = null;
		if (this._satellites.length >= this.MAX_SATELLITE) {
			// get back a hidden satellite:
			satellite = this.getTheFirstHiddenSatellite();
			if (satellite) {
				satellite.reset();
				satellite.x = 100;
				satellite.y = 100;
				satellite.fix({x: 400, y: 800}, distance, 45);	
			}
		}
			
		if (!satellite) {
			satellite = Crafty.e(DISPLAY_COMPONENTS + ", " + name + ", Satellite, Collision")
				.attr({x: 100, y: 100})
				.fix({x: 400, y: 800}, distance, 45)
			//	.gain(1)
				.collision(new Crafty.polygon([[2, 20],[62, 20],[62, 44],[2, 44]]));
			this._satellites.push(satellite);
		}
		
		return satellite;
	}
});