/////////////////////////////////////
// Be carefull, this is a dirty code.
// Read it at your own risk
// ©floriaen 2012
//////////////////////////////////

Crafty.c('SnakeHead', {
	
	positions: new Array(),

	free: true,
	
	tail: new Array(),
	
	path: null,
	
	_speed: 3,
	_stop: false,
	_rx: 0,
	_ry: 0,
	startIndex: 0,
	
	_eatFood: null,
	_lastTeniaPart: null,

	_direction: {
		right: false,
		left: false,
		top: false,
		bottom: false
	},
	
	init: function() {
		this.bind("TweenEnd", function() {
			this._speedNotReached = false;
		});
	},
	
	die: function() {
		return;
		
		while (this.tail.length >= 1) {
			this.detachBody();
		}
	},

	setSpeed: function(speed) {
		if (this._speedNotReached === false) {
			this._speed = speed;
		}
	},
	
	getSpeed: function() {
		return this._speed;
	},

	stop: function() {
		// tween over the speed
		this._speedNotReached = true;
		this._speed = 0; // TW
	},
	
	enrage: function() {
		this._isEnraged = true;
	},
	
	calm: function() {
		this._isEnraged = false;
	},
	
	isEnraged: function() {
		return this._isEnraged;
	},
	
	_getIndexDiff: function() {
		var s = this._speed;
		if (!this._indexDiffs.hasOwnProperty(s)) {
			var gap = 20;
			var startIndex = 0;
			var lx = snake.positions[0].x;
			var ly = snake.positions[0].y;
			do {
				p = snake.positions[startIndex++];
				if (p) {
					// get back the point we need:
					distance = Math.sqrt(Math.pow((lx - p.x), 2) + Math.pow((ly - p.y), 2));
				} else {
					// p = snake.positions[startIndex];
					break;
				}
			} while (startIndex < snake.positions.length && !((distance >= (gap - 1)) && (distance <= (gap + 1))));
		}
	},

	
	attachBody: function() {
		var tp = this.tail.length;
		if (this.tail.length >= MAX_SNAKE_PART) {
			// do nothing
			return this;
		}

		var startIndex = Math.max(0, snake.positions.length);
		if (this._lastTeniaPart == null) {
			this._lastTeniaPart = this; // the beast
			startIndex--;
		} else {
			startIndex = this._lastTeniaPart.startIndex;
		}			 
		
		var p = snake.positions[startIndex - 1];
		
		if (!p) {
			p = {
				x: snake.x,
				y: snake.y
			};
			//startIndex--;
		}
		
		var tail = Crafty.e("2D, Canvas, tail, SpriteAnimation, snakeBody, Collision")
		//	.animate('go_vertical', 1, 8, 1)
		//	.animate('go_horizontal', 0, 8, 0)
			.animate('tail', 0, 8, 1)
			.attach(this._lastTeniaPart)
			.attr({
				part: this.tail.length,
				x: p.x, 
				y: p.y,
				lastTeniaSpeed: snake.speed,
				startIndex : startIndex - 1, //newStartIndex,
				z: MAX_SNAKE_PART - this.tail.length					
			})	
			//.collision(new Crafty.circle(TILE_SIZE/2, TILE_SIZE/2, TILE_SIZE/2))

		//	.collision(new Crafty.polygon([[2, 2],[30, 2],[30, 30],[2, 30]]))
			.bind("EnterFrame", function() {
				//this.animate('tail', 20);
				var toPoint = snake.positions[this.startIndex];
				if (toPoint) {
					var diffX = this.x - toPoint.x;
					var diffY = this.y - toPoint.y;

					if (diffX < 0) {
						this.x = Math.min(toPoint.x, this.x + snake.speed);
					} else 
					if (diffX > 0) {
						this.x = Math.max(toPoint.x, this.x - snake.speed);
					}

					if (diffY < 0) {
						this.y = Math.min(toPoint.y, this.y + snake.speed);
					} else 
					if (diffY > 0) {
						this.y = Math.max(toPoint.y, this.y - snake.speed);
					}
				}	
			})
			.bind("tailIncrement", function() {
				this.startIndex++;
			});	
			
		this.tail.push(tail);
		this._lastTeniaPart = tail;
		
		return this;
	},
	
	detachBody: function() {
		snake.free = false;
		var lastTeniaPart = this.tail.pop();
		this._lastTeniaPart = this.tail[this.tail.length - 1];
		if (lastTeniaPart == null) {
			snake.free = true;
		} else {
			//console.log('explode ', snake.tail.length)
			lastTeniaPart.detach(function() {
				snake.free = true;
			});
			lastTeniaPart.destroy();
		}
		return this;
	}
});