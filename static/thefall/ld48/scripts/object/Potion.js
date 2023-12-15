var Potion = Class.create(UserData, {
	initialize: function($super, type, box2dBody) {
		$super(type, box2dBody);
		this._tileset = game.sprite.getTileset(type);
	},
	
	isConsumable: function() {
		return true;
	},
	
	update: function($super, box2dBody, context) {
		$super(box2dBody, context);
	}
});