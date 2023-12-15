/////////////////////////////////////
// Be carefull, this is a dirty code.
// Read it at your own risk
// ©floriaen 2012
//////////////////////////////////

Crafty.c("Message", {
	Message: function(x, y, color, size) {
		this.addComponent("2D, DOM, Text");
		this.textFont({family: 'SilkscreenNormal', size: size + 'px'});
		this.textColor(color);
		this.css({"text-align": "center"});
	}
});

// .attr({x: 0, y: (HEIGHT * 2 - 150) / 2, w: WIDTH * 2, h: 150, alpha: 0, messageText: null, spaceText: null})
Crafty.c("Alert", {
	init: function() {
		this.addComponent("2D, DOM, Text");
		this.attr({
			x: 0, 
			y: (HEIGHT * 2 - 150) / 2, 
			w: WIDTH * 2, 
			h: 150,
			alpha
		});
		
		this.bind("TweenEnd", function(e) {
			// display the messages:
			this.addComponent()
		});
	},
	
	display: function(itemsCount) {	
		
		this.tween({"alpha": 0.7}, 20);
	}
});