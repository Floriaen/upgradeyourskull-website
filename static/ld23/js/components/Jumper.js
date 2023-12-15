Crafty.c("Jumper", {
	_speed: 3,
	_jump: 3,
	_maxJump: 3,
	_maxJumpOrigin: 3,
	_up: false,
	_keyUp: true,

	init: function () {
		this.requires("Fourway, Keyboard");
		this.requires("")
	},
	
	_resetMaxJump: function() {
		this._maxJump = this._maxJumpOrigin;
	},

	gravity: function(component, polygon) {
		this.requires("Gravity").gravity(component);
		this.requires("Collision")
			.collision(polygon)
			.onHit(component, function(e) {				
				this._resetMaxJump();
			})
			.onHit("Satellite", function(e) {
				var y = e[0].obj.y;
				if (this.y <= y) { // we jump in
					// this.stopFalling();
					if (this.isDown("SPACE")) {
						this._maxJump += 1;
						this._falling = false;
					} else {
						this.stopFalling();
					}
				}

			});
		return this;
	},

	jumper: function (speed, jump) {

		this.multiway(speed, {});

		//if (speed) this._speed = speed;
		this._jump = jump || this._speed * 2;
		this._maxJump = this._jump;
		this._maxJumpOrigin = this._jump;

		this.bind("EnterFrame", function () {
			if (this.disableControls) return;
			if (this._up) {
				if (this.isDown("SPACE")) {	
					var jumpConst = 4;
					this._jump = (this._jump + jumpConst) > this._maxJump ? this._maxJump : (this._jump + jumpConst);
					// Crafty.trigger("Accelerate");
				}
				
				this.y -= this._jump;
				this._falling = true;
			} else {
				this._resetMaxJump();
			}
		}).bind("KeyDown", function (e) {
			if (this.isDown("SPACE")) {
				this._up = true;
			}
		}).bind("KeyUp", function(e) {
			if (e.key === Crafty.keys["SPACE"]) {
				// reset
				this._resetMaxJump();
			}
		})

		return this;
	}
});