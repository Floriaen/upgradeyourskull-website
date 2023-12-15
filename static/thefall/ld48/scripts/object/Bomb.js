var Bomb = Class.create(UserData, {
	initialize: function($super, box2dBody) {
		$super('bomb', box2dBody);
		this.setTileset(game.sprite.getTileset('bomb'));
		this._graphics.increment = 1;
		this._graphics.row = 0;// Math.floor(Math.random() * (this._tileset.r - 1))
		
		this._explode = false;	
		this._explodeCounter = 0;
		
		this._timerLimit = ((0.5 + Math.random() * 4) << 0) + 2;
		this._hFlip = (this._timerLimit >= 4) ? true : false;
	},
	
	isConsumable: function() {
		return true;
	},
	
	kill: function($super) {
		// wait before die
		this._explode = true;
		//this._die
	},
	
	update: function($super, box2dBody, context) {
		$super(box2dBody, context);
		this._explodeCounter = (this._explodeCounter + 1) % this._timerLimit;
		
	//	box2dBody.SetBullet(true);		
		if (this._tileset) {
			if (this._explode) {
				if (this._explodeCounter == 0) {
					if (this._graphics.row + 1 > this._tileset.r) {
						this._explode = false;
						this._died = true;
					} else {
						this._graphics.row++;
					}
				}
			}
			this._graphics.tileX = this._tileset.x + this._tileset.w * this._graphics.row;
			this._graphics.tileY = this._tileset.y;	
			
		//	this._x -= 10;
		//	this._y -= 10;		
		}
	}
	/*
	draw: function($super) {
		$super();
		this._context.save();
		this._context.translate(this._x, this._y);		
		this._context.color = 'black';
		this._context.strokeRect(
			- (0.5 + this._tileset.w/2) << 0, 
			- (0.5 + this._tileset.h/2) << 0, 
			this._tileset.w, this._tileset.h
		);
		
		this._context.restore();
	}
	*/
});