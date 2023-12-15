var PowerElementCount = Class.create({
    
	initialize: function(name, max) {
		this._name = name;
		this._max = max;
		this._historyCount = 0;
		this._count = 0;
		
		this._counter = 0;
		this._resetingCount = false;
		this._reset = false;
	},
	
	getAllCollectedElements: function() {
		return this._historyCount;
	},
	
	addElement: function() {
		this._count = Math.min(this._max, this._count + 1);
		this._historyCount++;
	},
	
	removeElement: function() {
		this._count = Math.max(0, this._count - 1);
		if (this._count == 0) {
			this._resetingCount = false;
		} else {
			this._resetingCount = true;
		}
	},
	
	isReseting: function() {
		return this._resetingCount;
	},
	
	isMaximumReached: function() {
		return this._count == this._max;
	},
	
	getName: function() {
		return this._name;
	},
	
	getCount: function() {
		return this._count;
	},
	
	reset: function() {
		if (this._reset === false) {
			this._reset = 0;
		}
	},
	
	clear: function() {
		this._count = 0;
	},
	
	update: function() {
		// DELAY
		if (this._reset !== false) {
			if (this._reset++ > 3) {
				this.removeElement();
				this._reset = false;
			}
		}
		
		// TIC
		this._counter = (this._counter + 1) % 3;
		if (this._counter == 0) {
			if (this._resetingCount == true) {
				this.removeElement();
			}
		}
	}
});

	