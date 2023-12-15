Crafty.c("CommonText", {
	init: function() {
		this.requires("2D, DOM, Text");
		this.css({"fontFamily": "SilkscreenNormal", "fontSize": "30px", "text-align": "center", "color": "white"});
	},

	textSize: function(value) {
		this.css({"fontSize": value + "px"});
		return this;
	},
	
	write: function(text) {	
		this.text(text);
		return this;
	}
});