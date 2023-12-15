Crafty.c("DelayConsumer", {
	_startConsume: 0,
	_gapConsume: 0,
	delayConsume: function(gap) {
		this._gapConsume = gap;
		return this;
	},
	startConsume: function() {
		this._startConsume = Crafty.frame();
		var consume = function() {
			if ((Crafty.frame() - this._startConsume) % this._gapConsume === 0) {
				// consume
				this.trigger("Consume");
			}
		};
		this.bind("EnterFrame", consume).bind("StopConsume", function() {
			this.unbind("EnterFrame", consume);
		});
	},

	stopConsume: function() {
		this.trigger("StopConsume");
	}

});