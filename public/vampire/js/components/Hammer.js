Crafty.c("Hammer", {
	_hammer: null,
	_hammerHandlers: {},
	
	hammer :function(element) {
		this._hammer = new Hammer(element);
		/*
		hammer.ondragstart = function(ev) { };
		hammer.ondrag = function(ev) { };
		hammer.ondragend = function(ev) { };

	    hammer.ontap = function(ev) { };
	    hammer.ondoubletap = function(ev) { };
	    hammer.onhold = function(ev) { };

	    hammer.ontransformstart = function(ev) { };
	    hammer.ontransform = function(ev) { };
	    hammer.ontransformend = function(ev) { };
		*/
		return this;
	},
	
	unbindHammer: function(eventName, handler) {
		// todo
	},
	
	bindHammer: function(eventName, handler) {
		this._hammer[eventName] = handler;
		return this;
	}
});