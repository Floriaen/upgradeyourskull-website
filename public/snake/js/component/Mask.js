Crafty.c("Mask", {
	_mask: null,
    init:function() {
		var tilesetImage = Crafty.assets["resources/sprite2.png"];
		
//		window.document.body.appendChild(tilesetImage);
	
        if (Crafty.support.canvas){ 
            // if(!this.map) this.collision();
            var drawed = 0, total = Crafty("Mask").length;
            this.requires("Sprite").bind("Draw",function() {
				console.log("test");
                if (drawed == total){
                    //ctx.clearRect(0,0,Crafty.viewport.width,Crafty.viewport.height);
                    drawed = 0;
                }

				if (!this._mask) {
					this._mask = this._getAlphaMask("#000000", tilesetImage, this.__coord[0], this.__coord[1], this.__coord[2], this.__coord[3]);
				}


					// this._mask.style.position = "absolute";
					// 				this._mask.style.top = "0px";
					// 				window.document.body.appendChild(this._mask);
					// 				console.log(this._mask);

				Crafty.canvas.context.drawImage(
					this._mask,	this.__coord[0], this.__coord[1], this.__coord[2], this.__coord[3],
					0, 0, 32, 32					
				);

                drawed++;
            }); 
        }
        
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