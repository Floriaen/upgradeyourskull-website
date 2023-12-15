var SimpleArray = Class.create({
	// @data, an array
	initialize: function(data) {
		this._data = data;
		this._currentIndex = 0;
	},
	
	getNext: function() {
		var next = null;
		if (this._data.length > 0) {
			if (this._currentIndex < this._data.length) {
				next = this._data[this._currentIndex++];
			} else {
				next = null;
				// then reset the currentIndex
				this._currentIndex = 0;
			}
		}		
		return next;
	}, 
	
	first: function() {
		this._currentIndex = 0;
	}
});