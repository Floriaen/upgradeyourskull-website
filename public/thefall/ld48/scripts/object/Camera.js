var Camera = Class.create({
	initialize: function(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		
		this._slide = false;
	},
	
	getOffsetX: function() {
		
	},
	
	slide: function(flag) {
		this._slide = flag;
	},
	
	getOffsetY: function(y) {
		var camY = 0;
		if (this._slide == true) {
			var camY = y - 2.6;//this._scaleRatio/2;
			if (camY > 0) {
			//	camY = 24 - 12;
			}
			if (camY < 0) {
				camY = 0;
			}
		}
		return camY;
		
	}
});