var ScoreBoard = Class.create({
	initialize: function() {
		this._data = {};
		this._currentY = 0;
		this._itemCount = '';
		this.newLine(0);
	},

	text: function(text, x, scale) {
		this._data[this._currentY].push({
			'text': text,
			'x': x,
			'scale': scale
		});
	},
	
	newLine: function(y) {
		this._currentY += y;
		this._data[this._currentY] = []; // create a new entry
	},
	
	
	showNextLine: function() {
		this._itemCount++;
	},
	
	draw: function(context) {
		var y, data = null;
		var c = 0;
		for (y in this._data) {
			if (c++ >= this._itemCount) {
				break;
			}
			var i = 0;
			for (i; i < this._data[y].length; i++) {
				data = this._data[y][i];
				game.textHelper.drawText(context, data.x, y, data.text, data.scale);
			}
		}
	}
});