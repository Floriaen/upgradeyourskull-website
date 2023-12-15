var Block = Class.create(UserData, {
	initialize: function($super, name, type, box2dBody) {
	    $super(name, box2dBody);
		this.setTileset(game.sprite.getTileset(name));
		this.type = type;
		this._light = 0;
		this._darkness = 0;
	},
	
	setName: function(name) {
		this.name = name;
		this.setTileset(game.sprite.getTileset(name));
	},
	
	infect: function() {
		if (this.type == 'fixedStep') {
			if (this.name == 'grass') {
				this.setName('fallingGrass');
			} else
			if (this.name == 'dirt') {
				this.setName('dirtFixed');
			}
			// this cause the block fall:
			if (this._body) {
				this._body.SetType(b2Body.b2_dynamicBody);
			}
		}
	},
	
	update: function($super, box2dBody, context) {
		$super(box2dBody, context);
		this._darkness = game.camera.y / 300;
	},
	
	setLight: function(value) {
		this._light = value;
	},
	
	getLight: function($super) {
		// 128 
		//var l = Math.pow(this._light, 1/this._darkness);
		//var v = 0.5 + (l - 0.5) * this._darkness;
		//return l;
		return this._light;
	},
	
	update: function($super, box2dBody, context) {
		$super(box2dBody, context);
		
	}
});