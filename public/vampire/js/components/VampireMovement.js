/**
 *
 * @event "flying"
 *
 */
Crafty.c("VampireMovement", {
	_speed: 3,
	_up: false,
	_upTime: null,
	_flyingDelay: 1,
	_jump: 3,

	init: function () {
		this.requires("Fourway, Keyboard");
	},

	vampireMovement: function (speed, jump) {

		this.multiway(speed, {
			RIGHT_ARROW: 0,
			LEFT_ARROW: 180,
			D: 0,
			A: 180
		});

		if (speed) this._speed = speed;
		this._jump = jump || this._speed * 2;

		this.bind("EnterFrame", function () {
			if (this.disableControls) return;
			if (this._up) {
				//this.y -= this._jump;
				this._movement.y -= this._jump;
				this._falling = true;

				if (this.isDown("UP_ARROW")) { // still down
					if (this._uptime && (Crafty.frame() - this._uptime) > this._flyingDelay) {
						this.trigger("FlyingRequest");
						this._uptime = null;	
					}
				}

			}
		}).bind("KeyDown", function () {
			if (this.isDown("UP_ARROW") || this.isDown("W")) {
				this._uptime = Crafty.frame();
				this._up = true;
			}

			if (this.isDown("UP_ARROW")) {
				
				
			}

		});

		return this;
	}
});