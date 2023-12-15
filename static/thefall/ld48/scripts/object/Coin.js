var Coin = Class.create(UserData, {
	initialize: function($super, box2dBody) {
		$super('coin', box2dBody);
		this._tileset = game.sprite.getTileset('coin');
		this._graphics.increment = 1;
		this._graphics.row = Math.floor(Math.random() * (this._tileset.r - 1));
		//this._graphics.row = 0;
		this._sourceOfLight = true;
		//this._vFlip = (Math.floor(Math.random() * 2) == 1) ? true : false;
	},
	
	isConsumable: function() {
		return true;
	},
	
	update: function($super, box2dBody, context) {
		
		if (this._counter == 0) {
			
		}
		
		$super(box2dBody, context);
//		box2dBody.SetBullet(true);
		if (this._counter == 0) {
			this._graphics.row = this._graphics.row + this._graphics.increment;
			if (this._graphics.row > this._tileset.r) {
				//this._graphics.increment = -1;
				this._graphics.row = 0;
			}
		}
		
		if (this._tileset) {
			// +1 avoid the use of the first tile
			this._graphics.tileX = this._tileset.x + this._tileset.w * (this._graphics.row);
			this._graphics.tileY = this._tileset.y;			
		}
	}
});