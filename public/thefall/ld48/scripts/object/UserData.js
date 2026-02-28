var UserData = Class.create({
	initialize: function(name) {
		this.name = name;
		this._body = null;
		this._tileset = null;

		this._counter = 0;
		this._halfCounter = 0;
		this._doubleCounter = 0;

		this._died = false;
		
		this._x = 0;
		this._y = 0;
		
		this._hFlip = false;
		this._vFlip = false;
		
		this._graphics = {
			ratio: 24,
			tileX: 0,
			tileY: 0,
			row: 0,
			hFlip: 1,
			vFlip: 1
		};
		
		this._sourceOfLight = false;
	},
	
	setFlip: function(hFlip, vFlip) {
		this._hFlip = hFlip;
		this._vFlip = vFlip;
	},
	
	isConsumable: function() {
		return false;
	},
	
	getLight: function() {
		return 0;
	},
	
	setTileset: function(tileset) {
		this._tileset = tileset;
	},
	
	getTileset: function() {
		return this._tileset;
	},
	
	/*
		@frames something like [1, 2, 3]
	*/
	addFromesForAction: function(action, frames) {
		this._frames[action] = frames;
	},
	
	update: function(box2dBody, context) {
		this._context = context;
		this._body = box2dBody;
		
		if (!this._died) {
			this._counter = (this._counter + 1) % 10;
			this._halfCounter = (this._halfCounter + 1) % 5;
			this._doubleCounter = (this._doubleCounter + 1) % 20;
			
			if (this._body) {			
				this._x = (0.5 + this._body.GetPosition().x * this._graphics.ratio) << 0;
				this._y = (0.5 + this._body.GetPosition().y * this._graphics.ratio) << 0;
			}

			if (this._tileset) {
				this._graphics.tileX = this._tileset.x;
				this._graphics.tileY = this._tileset.y;			
			}

			this._graphics.hFlip = (!this._hFlip) ? 1: -1;
			this._graphics.vFlip = (!this._vFlip) ? 1: -1;
		} else {
			if (this._sourceOfLight) {
				this._sourceOfLight = false;				
				var i = 0;
				var prev = null;
				while (i++ < 2) {
					prev = box2dBody.m_prev;
					if (prev) {
						userData = prev.GetUserData();
						if (userData && userData.hasOwnProperty('setLight')) {
							userData.setLight(userData.getLight() - 1);
						}
					}
				}
			}
		}
	},
	
	isDead: function() {
		return this._died;
	},
	
	kill: function() {
		this._died = true;
	},
	
	killedBy: function(userDataEntity) {
		userDataEntity.giveLife();
		this.kill();
	},
	
	giveLife: function() {
		this._life++; //TODO
	},

	draw: function() {
		
		if (this.isDead()) return; // does not draw nothing
	
		this._context.save();
		this._context.translate(this._x, this._y);
		this._context.scale(this._graphics.hFlip, this._graphics.vFlip);
	
		game.painter.drawTile(
			'main',
			this._tileset.image, 
			this._graphics.tileX, 
			this._graphics.tileY, 
			this._tileset.w, 
			this._tileset.h, 
			- (0.5 + this._tileset.w/2) << 0, 
			- (0.5 + this._tileset.h/2) << 0, 
			this._tileset.w, this._tileset.h,
			this._body.GetAngle()
		);

		var alpha = this.getLight();
		if (alpha > 0) {
			if (!this._tileset.hasOwnProperty('mask')) {
				this._tileset.mask = CanvasHelper.createAlphaMask(
					[25, 12, 00], //190C00
					//[0, 0, 0],
					this._tileset.image, 
					this._graphics.tileX, 
					this._graphics.tileY, 
					this._tileset.w, 
					this._tileset.h
				);
			}
			this._context.globalAlpha = alpha;
			this._context.drawImage(
				this._tileset.mask, 0, 0, this._tileset.w, this._tileset.h,
				- (0.5 + this._tileset.w/2) << 0, - (0.5 + this._tileset.h/2) << 0, 
				this._tileset.w, this._tileset.h
			);
			/*
			this._context.fillStyle = "rgba(0, 0, 0, " + alpha + ")";
			this._context.fillRect(
				-Math.floor(this._tileset.w/2), -Math.floor(this._tileset.h/2), 
				this._tileset.w, this._tileset.h
			);
			*/
		}		
		
		this._context.restore();
	}
});