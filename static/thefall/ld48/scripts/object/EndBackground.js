var EndBackground = Class.create({
	
	initialize: function(width, height) {
		this._counter = 0;
		this._x = 0;
		this._y = 0;
		this._context = null;
		
		
		this.width = width;
		this.height = height;
		this._draw = false;
	},
	
	update: function(context, camera, maxMapHeight) {
		this._context = context;
		this._x += (0.5) << 0;
		this._y =  maxMapHeight - camera.y * 24;
		/*
		
		TODO
		
		if (this._y <= camera.width * 24) {
			this._draw = true;
		} else {
			this._draw = false;
		}
		*/
		this._draw = true;
	},
	
	draw: function() {
		if (this._draw) {
		//	console.log('can draw');
			this._counter = (this._counter + 1) % 20;
			this._context.save();
			this._context.translate(this._x, this._y);
			this._context.scale(1, -1);
			this._context.drawImage(menuResource,0, 0, menuResource.width, menuResource.height, 0, 0, this.width, menuResource.height);
			//game.textHelper.drawText(this._context, 22, 43, 'FALL TO START', 0.5);
			this._context.restore();
		}
	}
});