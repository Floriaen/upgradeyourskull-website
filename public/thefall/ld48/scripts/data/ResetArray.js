var ResetArray = Class.create({
	// @data, an array
	initialize: function(data) {
		this._data = data;
		this._currentIndex = 0;
	},
	
	getNext: function() {
		var next = null;
		if (this._data.length > 0) {
			if (this._currentIndex >= this._data.length - 1) {
				this._currentIndex = 0;
			} else {
				this._currentIndex++;
			}
			// consume
			next = this._data[this._currentIndex];
		}		
		return next;
	}, 
	
	first: function() {
		this._currentIndex = 0;
	}
});