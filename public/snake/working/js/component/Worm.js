/////////////////////////////////////
// Be carefull, this is a dirty code.
// Read it at your own risk
// ©floriaen 2012
//////////////////////////////////

Crafty.c('Worm', {
	move: {left: false, right: false, up: false, down: false},	
	speed: 0,
	crazyControl: false,
	crazyPortal: false,
	
	_invincible: false,
	_invisible: false,
	_bigger: false,
	
	_bringToFire: 0,
	_disableControl: false,
	
	_dying: false,
	_dyingAnimation: 'wormExplosionAnimation',
	isDied: false,
	
	lastX: 160, 
	lastY: 144,
	
	toX:160,
	toY:160,
	
	setInvincible: function(flag) {
		if (this._invincible !== flag) {
			this._invincible = flag;
			this.trigger('InvicibleStateHasChanged');
		}
	},
	
	isInvicible: function() {
		return this._invincible;
	},
		
	setInvisible: function(flag) {
		if (this._invisible !== flag) {
			//console.log("change");
			this._invisible = flag;
			this.trigger('WormVisibilityHasChanged');
		}
	},
	
	isInvisible: function() {
		return this._invisible;
	},
	
	setBigger: function(flag) {
		// if (flag === true) {
		// 	this.speed = Speed.WORM_SPEED - 1;
		// } else {
		// 	this.speed = Speed.WORM_SPEED;
		// }
		this._bigger = flag;
		return this;
	},
	
	isBig: function() {
		
		return this._bigger;
	},
	
	die: function(nature) {
		if (this._invincible === false) {
			if (this._dying || this.died) return;

			this._dyingAnimation = nature || 'wormExplosionAnimation';
			if (!this._dying && !this.isDied) {
				this._dying = true;
				Score.wormKilled().update();
			}
		}
	},
	
	collide: function(obj) {
		if (this.isLeft()) {
			this.goTo(obj.x + TILE_SIZE, obj.y);
		} else
		if (this.isRight()) {
			this.goTo(obj.x - TILE_SIZE, obj.y);
		} else
		if (this.isBottom()) {
			this.goTo(obj.x, obj.y - TILE_SIZE);
		} else 
		if (this.isTop()) {
			this.goTo(obj.x, obj.y + TILE_SIZE);
		}
	},
	
	move: function() {
		this.requires('Moveable');
		
		var newX = this.x;
		var newY = this.y;

		if (this.x === this.toX && this.y === this.toY) {
			
			if (this.isDown("RIGHT_ARROW")) {
				this.toX += TILE_SIZE;
				this._stopAtFrame = null;
			} else if(this.isDown("LEFT_ARROW")) {
				this.toX -= TILE_SIZE;
				this._stopAtFrame = null;
			} else if(this.isDown("UP_ARROW")) {
				this.toY -= TILE_SIZE;
				this._stopAtFrame = null;
			} else if(this.isDown("DOWN_ARROW")) {
				this.toY += TILE_SIZE;
				this._stopAtFrame = null;
			} else {
				// init the stop
				if (this._stopAtFrame == null) {
					this._stopAtFrame = Crafty.frame();
				} 
				
				if (Crafty.frame() - this._stopAtFrame > 60) {
					//this.speed -= 0.3;
					//if (this.speed <= Speed.Score. )
					
					
					// random move:
					var r = Crafty.math.randomInt(0, 3);
					if (r == 0) {
						this.toX -= TILE_SIZE;
					} else
					if (r == 1) {
						this.toX += TILE_SIZE;
					} else
					if (r == 2) {
						this.toY += TILE_SIZE;
					} else {
						this.toY -= TILE_SIZE;
					}
				}
			}
		}
		
		var diffX = this.x - this.toX;
		var diffY = this.y - this.toY;

		if (diffX < 0) {
			newX = Math.min(this.toX, this.x + this.speed);
		} else 
		if (diffX > 0) {
			newX = Math.max(this.toX, this.x - this.speed);
		}

		if (diffY < 0) {
			newY = Math.min(this.toY, this.y + this.speed);
		} else 
		if (diffY > 0) {
			newY = Math.max(this.toY, this.y - this.speed);
		}
		
		this.setNewPosition(newX, newY);
	},
	
	goTo: function(x, y) {
		this.toX = x;
		this.toY = y;
	},
	
	crazyMove: function() {
		this.requires('Moveable');
		
		var newX = this.x;
		var newY = this.y;

		if (this.x === this.toX && this.y === this.toY) {
			
			if (this.isDown("RIGHT_ARROW")) {
				this.toX -= TILE_SIZE;
			} else if(this.isDown("LEFT_ARROW")) {
				this.toX += TILE_SIZE;
			} else if(this.isDown("UP_ARROW")) {
				this.toY += TILE_SIZE;
			} else if(this.isDown("DOWN_ARROW")) {
				this.toY -= TILE_SIZE;
			} else {
				
			}
		}
		
		
		var diffX = this.x - this.toX;
		var diffY = this.y - this.toY;

		if (diffX < 0) {
			newX = Math.min(this.toX, this.x + this.speed);
		} else 
		if (diffX > 0) {
			newX = Math.max(this.toX, this.x - this.speed);
		}

		if (diffY < 0) {
			newY = Math.min(this.toY, this.y + this.speed);
		} else 
		if (diffY > 0) {
			newY = Math.max(this.toY, this.y - this.speed);
		}
		
		this.setNewPosition(newX, newY);
	},
	
	Worm: function(speed) {
	//	if(speed) this._speed = speed;
		this.speed = speed;
		this.bind('EnterFrame', function() {
			if (this._disableControl == true) return;

			this.lastX = this.x;
			this.lastY = this.y;
			
			if (!this.crazyControl) {
				this.move();
			} else {
				this.crazyMove();
			}
			
		});
		
		return this;
	}
});