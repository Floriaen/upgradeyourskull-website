var Sprite = Class.create({
	initialize: function(source) {
		this._image = null;
		this._source = source;	
		this._tilesets = {};
	},
	
	load: function(onload) {
		var s = this;
		var image = new Image();
		image.onload = function() {
			s._image = this;
			onload.call(s);
		};
		image.src = this._source;
	},
	
	getImage: function() {
		return this._image;
	},
	
	addTileset: function(id, x, y, width, height, row) {
		this._tilesets[id] = {
			x: x,
			y: y,
			w: width,
			h: height,
			r: row
		};
	},
	
	getTileset: function(id) {
		var tileset = null;
		if (this._tilesets.hasOwnProperty(id)) {
			tileset = this._tilesets[id];
			// add a reference of the image source
			tileset.image = this.getImage();
		}
		return tileset;
	}
});