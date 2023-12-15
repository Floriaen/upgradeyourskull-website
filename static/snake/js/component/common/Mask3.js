/////////////////////////////////////
// Be carefull, this is a dirty code.
// Read it at your own risk
// ©floriaen 2012
//////////////////////////////////

Crafty.c("Mask", {
	_mask: null,
	_colorMask: null,
	ready: false,
	// _alpha: 0.5,
    init:function() {
		var tilesetImage = Crafty.assets["resources/sprite2.png"]; // TODO
		
		var draw = function (e) {
			var co = e.co,
				pos = e.pos,
				context = e.ctx;

			if (e.type === "canvas") {
				if (this._color) {
					context.save();
					context.fillStyle = 'rgba(40, 40, 40, 0.4)';
					// e.ctx.globalAlpha = this._alpha;
					//if (!this._mask) {
						
						
					/*	
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
					*/
					
					this._mask = this._getAlphaMask([0, 0, 0], tilesetImage, this.__coord[0], this.__coord[1], this.__coord[2], this.__coord[3]);
					//}
					
					// debug:
					context.beginPath();
					context.moveTo(pos._x, pos._y);
					context.lineTo(pos._x + pos._w, pos._y);
					context.lineTo(pos._x + pos._w, pos._y + pos._h);
					context.lineTo(pos._x, pos._y + pos._h);
					context.closePath();
					context.stroke();
					
					var oldGlobalAlpha = context.globalAlpha;
					context.globalAlpha = 0.6;
					//draw the image on the canvas element
					context.drawImage(this._mask, //image element
									 0, 0, 32, 32,
									 pos._x, //x position on canvas
									 pos._y, //y position on canvas
									 pos._w, //width on canvas
									 pos._h //height on canvas
					);
					context.globalAlpha = oldGlobalAlpha;
					context.restore();
				}
				
			} else if (e.type === "DOM") {
				// this._element.style.background = "url('" + this.__image + "') no-repeat -" + co.x + "px -" + co.y + "px";
			}
		};

		
		// its must be the first one so:
		this.bind("Draw", draw).bind("RemoveComponent", function (id) {
			if (id === "Mask") this.unbind("Draw", draw);
		});
		this.ready = true;
        return this;
    },

	mask: function (sprite, color, strength) {
		var el = Crafty(sprite);
		this.__coord = el.__coord;
		
		this._color = Crafty.toRGB(color, strength);

		this.trigger("Change");
		return this;
	},

	_getAlphaMask: function(color, data, x, y, width, height) {
		var output = document.createElement('canvas'); // create an hidden canvas
		output.width = width;
		output.height = height;
		var ctx = output.getContext('2d');
		ctx.drawImage(data, x, y, width, height, 0, 0, width, height);
		var c = ctx.getImageData(0, 0, width, height);
		for (var i = 0, len = c.data.length; i < len; i = i + 4) {
			c.data[i] = color[0];
			c.data[i + 1] = color[1];
			c.data[i + 2] = color[2];
			// alpha still the same
		}
		ctx.putImageData(c, 0, 0); // update 
		return output;
	}
});