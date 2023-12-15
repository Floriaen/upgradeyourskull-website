var CanvasHelper = new (
	Class.create({
		initialize: function() {
		
		},
	
		/**
		 * @color fill with color => rgb array like [0, 0, 0] for black
		 * @data the source: image/canvas object
		 **/
		createAlphaMask: function(color, data, x, y, width, height) {
			var output = document.createElement('canvas');
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
	})
)();