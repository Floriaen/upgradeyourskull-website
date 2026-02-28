var Level = Class.create(UserData, {
	initialize: function(level, gameSpriteUrl, fontSpriteUrl, colors) {
		this._version = (new Date()).getTime();
		
		this._colors = colors;
		this._level = level;
		
		menuResource = new Image();
		menuResource.src = 'resources/game/menu.png' + '#' + this._version; // TODO load this

		this._gameSprite = this._getGameSprite(gameSpriteUrl);
		this._fontSprite = this._getFontSprite(fontSpriteUrl);
	},
	
	_getJColors: function() {
		var i = 0, outColors = [];
		for (i; i < this._colors.length; i++) {
			// convert to manipulated color object:
			outColors.push(new jColour(this._colors[i]));
		}
		return outColors;
	},
	
	load: function(handler) {
		this._jColors = this._getJColors();
		if (handler) {
			handler();
		}
	},
	
	getBackgroundColors: function() {
		return this._jColors;
	},
	
	getGameSprite: function() {
		return this._gameSprite;
	},
	
	getFontSprite: function() {
		return this._fontSprite;
	},
	
	getLevel: function() {
		return this._level;
	},
	
	_getGameSprite: function(url) {
		// create the main sprite
		var s = new Sprite(url + '#' + this._version);
		
		s.addTileset('dirt', 0, 16, 16, 16, 1);
		s.addTileset('block', 0, 0, 16, 16, 1);
		s.addTileset('grass', 16, 16, 16, 16, 1);
		s.addTileset('dirtFixed', 32, 16, 16, 16, 1);
		s.addTileset('fallingGrass', 48, 16, 16, 16, 1);
		
		// potion:
		s.addTileset('curse', 0, 84, 8, 8, 1);
		s.addTileset('cure', 8, 84, 8, 8, 1);			
		
		s.addTileset('dirtB', 64, 16, 16, 16, 1);
		s.addTileset('grassB', 80, 16, 16, 16, 1);
		s.addTileset('dirtFixedB', 96, 16, 16, 16, 1);
		s.addTileset('fallingGrassB', 112, 16, 16, 16, 1);
		
		
		s.addTileset('coin', 0, 72, 10, 10, 3);
		
		s.addTileset('hero', 0, 32, 10, 10, 23);

		s.addTileset('heroBox', 0, 32, 16, 16, 4); // cursed
		
		s.addTileset('heroMask', 52, 54, 26, 26, 3);
		s.addTileset('heroHead', 0, 62, 10, 10, 3);
		/*
		s.addTileset('heroSkull', 0, 62, 10, 10, 4);
		s.addTileset('heroBrain', 0, 72, 10, 10, 4);
		s.addTileset('heroPea', 0, 82, 10, 10, 4);	
*/
		s.addTileset('fire', 0, 92, 6, 6, 4);
		//s.addTileset('flower', 0, 98, 6, 6, 2);
		s.addTileset('bomb', 0, 104, 30, 29, 4);
		//s.addTileset('boss', 0, 109, 160, 159, 1);
		//s.addTileset('invisible',  0, 32, 16, 16, 1);
		//s.addTileset('bug',  0, 134, 16, 16, 1);
		
		return s;
	},
	
	_getFontSprite: function(url) {
		var s = new Sprite(url + '#' + this._version);
		s.addTileset('atarifont', 0, 64, 16, 32, 16);
		return s;
	}
	
});
		
	