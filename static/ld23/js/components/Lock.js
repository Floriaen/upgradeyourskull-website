Crafty.c("Lock", {
	_component: null,
	_initialPos: {x: 0, y: 0},
	_init : false,
	init: function () {
 		this.requires("2D");
	},
	
	lock: function() {
		
		this._initialPos.x = this.x;
		this._initialPos.y = this.y;
		this.bind("Change", function() {
			this._x = this._initialPos.x - Crafty.viewport.x;
			this._y = this._initialPos.y - Crafty.viewport.y;
		});
		return this;
	}
});