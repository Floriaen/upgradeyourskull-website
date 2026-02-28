var GoAndBackArray = Class.create({
	// @data, an array
	initialize: function(data) {
		this._data = data;
		this._currentIndex = 0;
		this._increment = 1;
	},

	getNext: function() {
		var next = null;
		if (this._data.length > 0) {
			if (this._currentIndex >= this._data.length - 1) {
				this._increment = -1;
			} else
			if (this._currentIndex == 0) {
				this._increment = 1;
			}
			// consume
			next = this._data[this._currentIndex];
			// and increment
			this._currentIndex = this._currentIndex + this._increment;
		}		
		return next;
	}, 
	
	first: function() {
		this._currentIndex = 0;
	}
});