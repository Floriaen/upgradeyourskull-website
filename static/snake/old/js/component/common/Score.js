/////////////////////////////////////
// Be carefull, this is a dirty code.
// Read it at your own risk
// ©floriaen 2012
//////////////////////////////////

Crafty.c("Score", {
	_items: 0,
	init: function() {
		var self = this;
		Crafty.bind("ItemFound", function(data) {
			self.setText(++self._items);
		});
	},
	Score: function(text) {
		this.setText(text);
		return this;
	},
	setText: function(text) {
		this._text = text;
		return this;
	},
	getText: function() {
		return this._text;
	}
});