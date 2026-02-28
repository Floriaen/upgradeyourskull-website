var Hero = Class.create(UserData, {
	initialize: function($super, box2dBody) {
	    $super('hero', box2dBody);
		this._steps = ['box', 'mask', 'head', 'skull', 'brain', 'pea'];
		//this._tilesets = {};
		this._step = 0;
		this._stepHasChanged = true;
		this._graphics.rowForFire = 0;
		
		this._graphics.subCounter = 0;
		this._graphics.row = 0;
		this._graphics.rowIncrement = 1;
		
		this._falling = false;
		this._fallingTimeout = null;
		
		this._mode = null;
		
		this._eating = false;
		this._cursed = false;
		
		this._frames = {
			cursed: new SimpleArray([0, 1, 2, 3]),
			eating: new GoAndBackArray([3, 4]),
			destructor: new GoAndBackArray([0, 1, 2, 3])
		};
		
		this._darknessEnable = false;
		this._init = false;
		
		this._modeInProgress = null;
	},
	
	setBody: function(body) {
		this._body = body;
	},	
	
	/*
	addTileset: function(name, tileset) {
		this._tilesets[name] = tileset;
	},
	*/
	setFalling: function(flag) {
		this._falling = flag;
	},
	
	isFalling: function() {
		return this._falling;
	},
	
	eat: function() {
		this._eating = true;
	},
	
	setCursed: function(flag) {
		if (flag !== this._cursed) {	
			if (flag) {
				this._modeInProgress = 'cursed';
				this._cursed = true;
				this.setStep(0);
				// this._cursed is set later (see #setMode)
				//this.setMode('cursed');
			} else {
				this._modeInProgress = 'normal';
				this._cursed = false;
				this.setStep(2);
				//this.setMode('normal');
			}
		}
	},
	
	setStep: function(step) {
		//this._step = 1;
		if (step != this._step) {
			this._step = step;
			this._stepHasChanged = true;
		}
		/*
		if (this._step < 5) {
			if (step != this._step) {
				this._step = step;
				//this._graphics.row = 0;
				this._stepHasChanged = true;
			}
			
		}
		*/
	},
	
	_callToBody: function(funct, value) {
		if (this._body) {
			//funct.call(this._body, value);
		}
	},
	
	_setMassToBody: function(mass) {
		if (this._body) {
			//this._body.ResetMassData();
			
			var massData = new b2MassData();
			massData.center = new b2Vec2(0.0, 0.0);
			massData.I = 0; // prevent the box to rotate
			massData.mass = mass;
			try {
				this._body.SetMassData(massData);
			} catch (e) {
			//	console.log(e);
			}
		}
	},
	
	setMode: function(mode) {
		//console.log('setMode ' + mode);
		
		if (mode != this._mode ) {//&& !this._cursed) {
			//console.log('setMode', mode);
			this._mode = mode;
			switch (mode) {
				case 'destructor':
					this.setStep(1);
					this._setMassToBody(500);
					game.bomb(this._body, 3, 100);
				break;
				case 'cursed':
					this._setMassToBody(1.8);
				break;
				default:					
					this.setStep(2);
					this._setMassToBody(1.8);
					
					
				break;
			}
		}
	},
	
	getMode: function() {
		return this._mode;
	},
	
	_ensureUserIsInBound: function(box2dBody, context) {
		// set to bound, user cannot go outside
		var p = box2dBody.GetPosition();
		var cw = context.canvas.width / this._graphics.ratio;
		var margin = 16 / this._graphics.ratio;
		if (p.x <= margin) {
			p.x = margin;
		} else 
		if (p.x >= cw - margin) {
			p.x = cw - margin;
		}
		
		if (p.y <= 0) {
			p.y = 0;
			box2dBody.m_linearVelocity.y = 0; // reset the force
		}
		
		box2dBody.SetPosition(p);
	},
	
	update: function($super, box2dBody, context) {
		this._ensureUserIsInBound(box2dBody, context);
		$super(box2dBody, context);
		
		if (this._stepHasChanged) {
			this._stepHasChanged = false;
			var stepName = this._steps[this._step];
			var stepTileset = 'hero' + new String(stepName).ucfirst();
			
			// change the current tileset:
			this._tileset = game.sprite.getTileset(stepTileset);
		}
		// each 
		if (this._modeInProgress) {
			switch (this._modeInProgress) {
				case 'cursed':
					if (this._halfCounter == 0) {
						var r = this._frames.cursed.getNext();
						if (r != null) {
							this._graphics.row = r;
						} else {
							// stay as is
							this._modeInProgress = null;
	 						this.setMode('cursed');
						}	
					}
				break;
				case 'normal':
					// TODO
					this._modeInProgress = null;
					this.setMode('normal');
					this._graphics.row = 0;
				break;
			}
			
		} else
		if (this.getMode() === 'cursed' && this._halfCounter === 0) {			
			this._graphics.row = 3; //this._frames.cursed.getNext();
		} else
		if (this._counter == 0) {
			/*
			// EAT
			if (this._eating === false) {
				// reset 
				this._frames.eating.first();
			}
			*/			
			if (this._falling === false) {
				if (this._eating == true) {
					this._eating = false;
					this._graphics.row = this._frames.eating.getNext();
				} else {
					this._graphics.row = 0;
				}
			} else {
				if (this.getMode() === 'destructor') {
					this._graphics.row = this._frames.destructor.getNext();
					if (this._graphics.row == 3) {
						game.bomb(box2dBody, 6, 40);
					}
				} else
				if (this._graphics.row < 2) { //3
					this._graphics.row = this._graphics.row + this._graphics.rowIncrement;
				} else
				if (this._graphics.row == 0) {
					this._graphics.rowIncrement = 1;
					this._graphics.row = this._graphics.row + this._graphics.rowIncrement;
				}
			}
		}
		this._graphics.tileY = this._tileset.y;
		this._graphics.tileX = this._tileset.x + this._tileset.w * this._graphics.row;
	}
});