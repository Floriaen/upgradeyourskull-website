var Background = Class.create({
	
	initialize: function(width, height) {
		this._counter = 0;
		this._x = 0;
		this._y = 0;
		this._context = null;
		
		
		this.width = width;
		this.height = height;
	},
	
	update: function(context, camera) {
		this._context = context;
		this._x += (0.5) << 0;
		this._y = (0.5 + (this._y, camera.y * 24)) << 0;
	},
	
	draw: function() {
		
		this._counter = (this._counter + 1) % 20;
		this._context.save();
		this._context.fillStyle = 'black';

		this._context.translate(- this._x, - this._y);
		this._context.drawImage(menuResource,0, 0, menuResource.width, menuResource.height, 0, 0, this.width, menuResource.height);
		this._context.restore();
		
		game.textHelper.drawText(this._context, 'auto', - this._y + 72, 'FALL TO START', 0.5);
	}
});