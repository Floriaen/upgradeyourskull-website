Crafty.c("Mask", {
	init: function() {
		
	},
	Mask: function(spriteName) {
		var tilesetImage = Crafty.assets["resources/sprite2.png"];

		// somthing add hoc:
		var sprite =  Crafty.components()[spriteName]
		if (sprite) {
			// unbind the draw function
		//	sprite.trigger('RemoveComponent');
			// then attach our new stuff:
			sprite.mask = this._getAlphaMask("#000000", tilesetImage, sprite.__coord[0], sprite.__coord[1], sprite.__coord[2], sprite.__coord[3]);
			console.log(sprite);
			var draw = function (e) {
				var co = e.co,
					pos = e.pos,
					context = e.ctx;

				if (e.type === "canvas") {

					context.drawImage(this.mask, //image element
									 co.x, //x position on sprite
									 co.y, //y position on sprite
									 co.w, //width on sprite
									 co.h, //height on sprite
									 pos._x, //x position on canvas
									 pos._y, //y position on canvas
									 pos._w, //width on canvas
									 pos._h //height on canvas
					);
					
					
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
				} else if (e.type === "DOM") {
					sprite._element.style.background = "url('" + sprite.__image + "') no-repeat -" + co.x + "px -" + co.y + "px";
				}
			};

			sprite.bind("Draw", draw).bind("RemoveComponent", function (id) {
				if (id === "Sprite") sprite.unbind("Draw", draw);
			});

		} else {
			throw new Error(spriteName + " no sprite found");
		}
	},
	
	applyMask: function(color, alpha) {
		
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