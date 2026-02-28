Crafty.c("Oriented", {
	init: function() {
		this.requires("2D");
	},
	go: function(orientation) {
		switch(orientation) {
			case 'top':
			break;
			case 'bottom':
			break;
			case 'left':
				if (this._flipX === undefined || this._flipX === false) {
					this._flipX = true;
					this.trigger("Change");
				}
			break;
			case 'right':
				if (this._flipX !== undefined && this._flipX === true) {
					this._flipX = false;
					this.trigger("Change");	
				}
			break;
		}
	}
});