var Bug = Class.create(UserData, {
	initialize: function($super, box2dBody) {
		$super('bug', box2dBody);
		this._tileset = game.sprite.getTileset('bug');
		this._hFlip = false;
	
		this._body = box2dBody;
		this._body.SetType(b2Body.b2_dynamicBody);
		
		this._velocity = 6;
		this._goRight = true;
		
		this._previousX = 0; // use instead of colision detection
	},
	
	goBack: function() {
		if (this._goRight === true) {
			this._goRight = false;
			this._velocity = - this._velocity;
		} else {
			this._goRight = true;
			this._velocity = this._velocity;
		}
	},
	
	update: function($super, box2dBody, context) {
		$super(box2dBody, context);

		this._body.SetAwake(true);
		this._body.m_linearVelocity.x = this._velocity;
		
		var posX = Math.round(this._body.GetPosition().x * 100) / 100;
		if (this._previousX === posX) {
			this .goBack();
		}

		this._previousX = posX;
	},
	
	draw: function($super) {
		
	}
});