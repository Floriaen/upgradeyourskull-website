/**@
* #Sprite
* @category Graphics
* @trigger Change - when the sprites change
* Component for using tiles in a sprite map.
*/
Crafty.c("Sprite", {
	__image: '',
	__tile: 0,
	__tileh: 0,
	__padding: null,
	__trim: null,
		
	img: null,
  //ready is changed to true in Crafty.sprite
	ready: false,
	
	
	__mask: false,
	__maskColor: null,
	__maskAlpha: null,
	__maskCanvas: null,
	__maskStorage: null,

	init: function () {
		this.__storage = {};
		this.__trim = [0, 0, 0, 0];

		var draw = function (e) {
			var co = e.co,
				pos = e.pos,
				context = e.ctx;

			if (e.type === "canvas") {
				//draw the image on the canvas element
				context.drawImage(this.img, //image element
								 co.x, //x position on sprite
								 co.y, //y position on sprite
								 co.w, //width on sprite
								 co.h, //height on sprite
								 pos._x, //x position on canvas
								 pos._y, //y position on canvas
								 pos._w, //width on canvas
								 pos._h //height on canvas
				);
				
				
				if (this.__mask) {
					var mask = this._getAlphaMask(this._colorMask, this.img,  co.x, co.y, co.w, co.h);
					var oldGlobalAlpha = context.globalAlpha;
					context.globalAlpha = this._alphaMask;
					//draw the image on the canvas element
					context.drawImage(mask, //image element
									 0, 0, co.w, co.h,
									 pos._x, //x position on canvas
									 pos._y, //y position on canvas
									 pos._w, //width on canvas
									 pos._h //height on canvas
					);
					context.globalAlpha = oldGlobalAlpha;
				}
				
			} else if (e.type === "DOM") {
				this._element.style.background = "url('" + this.__image + "') no-repeat -" + co.x + "px -" + co.y + "px";
			}
		};

		this.bind("Draw", draw).bind("RemoveComponent", function (id) {
			if (id === "Sprite") this.unbind("Draw", draw);
		});
	},
	
	_getMaskCanvas: function(w, h) {
		if (!this.__maskCanvas) {
			this.__maskCanvas = document.createElement('canvas'); // create an hidden canvas
		}
		var mc = this.__maskCanvas.cloneNode();
		// redim:
		mc.width = w;
		mc.height = h;
		return mc;
	},
	
	_createAlphaMask: function(color, data, x, y, w, h) {
		var rgb = this._toRGBArray(color);
		var mask = this._getMaskCanvas(w, h);
		var ctx = mask.getContext('2d');
		ctx.drawImage(data, x, y, w, h, 0, 0, w, h);
		var c = ctx.getImageData(0, 0, w, h);
		for (var i = 0, len = c.data.length; i < len; i = i + 4) {
			c.data[i] = rgb[0];
			c.data[i + 1] = rgb[1];
			c.data[i + 2] = rgb[2];
			// alpha still the same
		}
		ctx.putImageData(c, 0, 0); // update 
		return mask;//.cloneNode();
	},
	
	_getHashFrom: function(color, data, x, y, w, h) {
		//var subData = '';
		var hash = color + data + x + y + w + h;
		return hash;
	},
	
	_getAlphaMask: function(color, data, x, y, w, h) {
		var hash = this._getHashFrom(color, data, x, y, w, h);
		if (!this.__storage.hasOwnProperty(hash)) {
			this.__storage[hash] = this._createAlphaMask(color, data, x, y, w, h);
		}
		return this.__storage[hash];
	},
	
	mask: function (color, strength) {
		this.__mask = true;
		this._colorMask = color;
		this._alphaMask = strength;
		this.trigger("Change");
		return this;
	},
	
	_toRGBArray: function(hex) {
		var hexa = (hex.charAt(0) === '#') ? hex.substr(1) : hex, c = [];
		c[0] = parseInt(hexa.substr(0, 2), 16);
		c[1] = parseInt(hexa.substr(2, 2), 16);
		c[2] = parseInt(hexa.substr(4, 2), 16);
		return c;
	},

	/**@
	* #.sprite
	* @comp Sprite
	* @sign public this .sprite(Number x, Number y, Number w, Number h)
	* @param x - X cell position
	* @param y - Y cell position
	* @param w - Width in cells
	* @param h - Height in cells
	* Uses a new location on the sprite map as its sprite.
	*
	* Values should be in tiles or cells (not pixels).
	*
	* @example
	* ~~~
	* Crafty.e("2D, DOM, Sprite")
	* 	.sprite(0, 0, 2, 2);
	* ~~~
	*/
	sprite: function (x, y, w, h) {
		this.__coord = [x * this.__tile + this.__padding[0] + this.__trim[0],
						y * this.__tileh + this.__padding[1] + this.__trim[1],
						this.__trim[2] || w * this.__tile || this.__tile,
						this.__trim[3] || h * this.__tileh || this.__tileh];

		this.trigger("Change");
		return this;
	},

	/**@
	* #.crop
	* @comp Sprite
	* @sign public this .crop(Number x, Number y, Number w, Number h)
	* @param x - Offset x position
	* @param y - Offset y position
	* @param w - New width
	* @param h - New height
	* If the entity needs to be smaller than the tile size, use this method to crop it.
	*
	* The values should be in pixels rather than tiles.
	*
	* @example
	* ~~~
	* Crafty.e("2D, DOM, Sprite")
	* 	.crop(40, 40, 22, 23);
	* ~~~
	*/
	crop: function (x, y, w, h) {
		var old = this._mbr || this.pos();
		this.__trim = [];
		this.__trim[0] = x;
		this.__trim[1] = y;
		this.__trim[2] = w;
		this.__trim[3] = h;

		this.__coord[0] += x;
		this.__coord[1] += y;
		this.__coord[2] = w;
		this.__coord[3] = h;
		this._w = w;
		this._h = h;

		this.trigger("Change", old);
		return this;
	}
});