var Fire = Class.create(UserData, {
	initialize: function($super, box2dBody) {
		$super('fire', box2dBody);
		this._tileset = game.sprite.getTileset('fire');
		this._graphics.increment = 1;
		this._graphics.row = Math.floor(Math.random() * (this._tileset.r - 1));
		
		this._hFlip = (Math.floor(Math.random() * 2) == 1) ? true : false;
		this._sourceOfLight = true;
	},
	
	isConsumable: function() {
		return true;
	},
	
	update: function($super, box2dBody, context) {
		$super(box2dBody, context);
		if (this._counter == 0) {
			this._graphics.row = this._graphics.row + this._graphics.increment;
			if (this._graphics.row >= this._tileset.r) {
				this._graphics.increment = -1;
			} else
			if (this._graphics.row <= 0) {
				this._graphics.increment = 1;
			}
		}
		
		if (this._tileset) {
			// +1 avoid the use of the first tile
			this._graphics.tileX = this._tileset.x + this._tileset.w * (this._graphics.row + 1);
			this._graphics.tileY = this._tileset.y;			
		}
	}
});