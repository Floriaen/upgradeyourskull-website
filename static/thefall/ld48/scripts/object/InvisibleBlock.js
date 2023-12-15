var InvisibleBlock = Class.create(UserData, {
	initialize: function($super, name, box2dBody) {
	    $super('invisible', box2dBody);
		this.setTileset(game.sprite.getTileset('invisible'));
	},
	
	update: function($super, box2dBody, context) {
		//$super(box2dBody, context);
	},
	
	draw: function($super) {
		// does not draw this block
	}
});