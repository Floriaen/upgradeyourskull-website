Crafty.c("Heart", {
	
	_inanimate: true,
	_massage: false,
	_revealTry: 0,
	
	init: function() {
	
	},
	
	isReveal: function() {
		return (this._inanimate === false);
	},
	
	reanimate: function() {
		if (!this._inanimate) return;
		
		console.log(this._revealTry);
		this._revealTry++;
		if (this._revealTry > 3) {
			this._revealTry = 0; // reset
			this._inanimate = false;
			this.trigger("Reanimate");
		} else {
			this.trigger("Reveal");
		}
	}
});