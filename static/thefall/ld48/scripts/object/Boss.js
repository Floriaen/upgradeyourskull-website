var Boss = Class.create(UserData, {
	initialize: function($super, box2dBody) {
		$super('boss', box2dBody);
		this.setTileset(game.sprite.getTileset('boss'));
		this._graphics.row = 1;// Math.floor(Math.random() * (this._tileset.r - 1))
	},
	/*
	draw: function($super) {
		$super();
		this._context.save();
		
		this._context.translate(this._x, this._y);
		//this._context.scale(this._graphics.vFlip, this._graphics.hFlip);
		this._context.strokeRect(
			- (0.5 + this._tileset.w/2) << 0, 
			- (0.5 + this._tileset.h/2) << 0, 
			this._tileset.w, this._tileset.h
		);		
		this._context.restore();
	}
	*/
});