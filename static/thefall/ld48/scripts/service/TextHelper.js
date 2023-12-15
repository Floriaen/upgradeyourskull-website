		
		/*
		fontSprite.load(function() {
			var textHelper = new TextHelper(fontSprite.getTileset('atarifont'));
			textHelper.cache(['FALL TO START', 'MES TESTS']);
			textHelper.drawText($("canvas").getContext('2d'), 0, 0, 'FALL TO START', 1);
		});
		*/

var TextHelper = Class.create({
	
	initialize: function(fontTileset) {
		this._cache = {};
		this._letters = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_';
		this._font = fontTileset;
	},
	
	cache: function(texts) {
		var i = 0;
		for (i = 0;i < texts.length; i++) {
			this._cacheText(texts[i]);			
		}
	},
	
	_getTileForLetter: function(letter) {
		var tile = null;
		var idx = this._letters.indexOf(letter.toUpperCase());
		if (idx >= 0) {
			var l = Math.floor(idx / this._font.r);
			var c = idx % this._font.r;
			tile = {
				x: c * this._font.w, // where the letter is
				y: this._font.y + (l * this._font.h),
				w: this._font.w,
				h: this._font.h
			};
		}
		return tile;
	},
	
	_getTextSize: function(text) {
		//this._font.w
		return {
			w: text.length * this._font.w,
			h: this._font.h
		}
	},
	
	_cacheText: function(text) {
		var textSize = this._getTextSize(text);
		
		var cvs = document.createElement('canvas');
		cvs.width = textSize.w;
		cvs.height = textSize.h;
		var c = cvs.getContext('2d');		
		var gap = 0;
		var i = 0;
		var scale = 1, x = 0, y = 0;
		for (i = 0; i < text.length; i++) {
			var tile = this._getTileForLetter(text[i]);
			if (tile) {
				c.drawImage(
					this._font.image, (0.5 + tile.x) << 0, tile.y, 
					tile.w, tile.h, 
					(0.5 + (gap + i *16) * scale) << 0 + x, y, 
					(0.5 + tile.w * scale) << 0, (0.5 + tile.h * scale) << 0
				);
			}
		}
		this._cache[text] = cvs;
	},
	
	drawText: function(context, x, y, text, scale) {
		if (!text || text.length === 0) return;
		
		scale = scale || 1;
		context.save();
		
		if (!this._cache.hasOwnProperty(text)) {
			this._cacheText(text);
		}
		
		var cvs = this._cache[text];
		if (x === 'auto') {
			x = (0.5 + ((context.canvas.width - cvs.width * scale) / 2)) << 0;
		}
		
		if (y === 'auto') {
			y = (0.5 + ((context.canvas.height - cvs.height * scale) / 2)) << 0;
		}
		
		context.translate(x, y);
		context.drawImage(
			cvs, 0, 0, 
			cvs.width, cvs.height, 
			0, 0, 
			(0.5 + cvs.width * scale) << 0, (0.5 + cvs.height * scale) << 0
		);
		context.restore();
	}
	
});