/////////////////////////////////////
// Be carefull, this is a dirty code.
// Read it at your own risk
// ©floriaen 2012
//////////////////////////////////

Crafty.c('Moveable', {
	_previousX: 0,
	_previousY: 0,
	setNewPosition: function(x, y) {
		this._previousX = this.x;
		this._previousY = this.y;
		this.x = x;
		this.y = y;
	},
	isLeft: function() {
		return (this._previousX > this._x);
	},
	isRight: function() {
		return (this._previousX < this._x);
	},
	isTop: function() {
		return (this._previousY > this._y);
	},
	isBottom: function() {
		return (this._previousY < this._y);
	}
});