var Painter = Class.create({
	
	initialize: function(board) {
		this._contexts = {};		
		this._setupLayer('main', 'canvas');
		this._setupLayer('bg1', 'background-1');
		this._setupLayer('bg2', 'background-2');
	},
	
	_setupLayer: function(name, elementId) {
		var bg = document.getElementById(elementId);
		if (bg) {
			this._contexts[name] = bg.getContext('2d');
		}
	},
	
	setDebugMode: function(flag) {
		this._debug = flag;
	},
	
	save: function(contextName) {
		var context = this._contexts[contextName];
		context.save();
	},
	
	restore: function(contextName) {
		var context = this._contexts[contextName];
		context.restore();		
	},
	
	fade: function(contextName, alpha) {
		if (alpha > 0) {
			var context = this._contexts[contextName];
			context.save();
			context.fillStyle = 'rgba(0, 0, 0, ' + alpha + ')';
			context.fillRect(0, 0, context.canvas.width, context.canvas.height);
			context.restore();
		}
	},
	
	drawTile: function(contextName, source, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight, angle) {
		var context = this._contexts[contextName];
		if (angle) {
			context.rotate(angle);
		}
		if (this._debug) {
			context.strokeRect(dx, dy, dHeight, dWidth);
		} else {
			try {
				context.drawImage(source, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
			} catch (e) {
				//console.log(sx, sy, sWidth, sHeight);
			}
			
		}
	},
	
	drawImage: function(contextName, source, x, y, w, h) {
		var context = this._contexts[contextName];
		if (!this._debug) {
			context.drawImage(source, x, y, w, h);
		}	
	}
});