/////////////////////////////////////
// Be carefull, this is a dirty code.
// Read it at your own risk
// ©floriaen 2012
//////////////////////////////////

function ItemGenerator() {
	this._items = null;
	this.items = null;
	
	this.itemGenerated = 0;
	this.maxItemGenerated = 0;
};

ItemGenerator.prototype = {
	
	loadSprite: function(itemsTileset, gameItems) {
		var items = {};
		for (var i = 0; i < gameItems.length; i++) {
			items[gameItems[i].key] = gameItems[i].pos;
			if (gameItems[i].hasOwnProperty("item")) {
				var obj = {};
				obj[gameItems[i].item.key] = gameItems[i].item.pos;
				Crafty.sprite(TILE_SIZE, itemsTileset, obj);
			}
		}
		Crafty.sprite(TILE_SIZE, itemsTileset, items);
		
		// create the items:
		this._items = gameItems; // storage
		this.items = gameItems.concat();
	},
	
	getRandomItem: function() {
		var r = Crafty.math.randomInt(0, this._items.length - 1);
		return this._items[r];
	},
	
	reset: function() {
		this.items = this._items.concat();
		this.itemGenerated = 0;
	},
	
	getNextItem: function() {
		var item = this.items.shift();
		if (!item) {
			this.items = this._items.shuffle();
			item = this.items.shift();
		}
		
		if (++this.itemGenerated > this.maxItemGenerated) {
			this.maxItemGenerated = this.itemGenerated;
		}
		
		return item;
	},
	
	hasItem: function(x, y) {
		var found = false;
		Crafty("2D").each(function() {
			var cl = this.__c;
			if (cl.hasOwnProperty("food") || cl.hasOwnProperty("Item")) {
				if (this.x == x && this.y == y) {
					found = true;
					return;
				}
			}
		});
		return found;
	},
	
	getFreePosition: function() {
		var col = WIDTH / TILE_SIZE - 2;
		var row = HEIGHT / TILE_SIZE - 2;
		
		var i = x = y = 0;
		do {
			x = Crafty.math.randomInt(1, col - 2);
			y = Crafty.math.randomInt(1, row - 2);
			n = x + y * WIDTH / TILE_SIZE;
		} while ((solidTile.indexOf(n) >= 0) || this.hasItem(x * TILE_SIZE, y * TILE_SIZE));
		
		return [x, y];
	},
	
	spawn: function(x, y) {
		var itemObject = this.getNextItem();		
		
		var itemLife = 100;
		
		var tweenItem = null;
		var itemOpacity = 1.0;
		
		var additionalComponent = "";
		if (itemObject.block === true) {
			additionalComponent = "Block, ";
		}
		
		if (itemObject.key == "portal") {
			itemLife = 100;
			itemOpacity = 0.8;
			
			var pos = this.getFreePosition();
			tweenItem = Crafty.e("2D, Canvas, Tween, Item, portal2")
				.attr({x: pos[0] * TILE_SIZE, y: pos[1] * TILE_SIZE, alpha: itemOpacity, z: ZINDEX.item})
				.bind("TweenEnd", function(e) {
					this.destroy();
				});
		}
		
		var item = Crafty.e("2D, Canvas, Tween, " + additionalComponent + "Item, " + itemObject.key)
			.attr({x: x, y: y, alpha: itemOpacity, lifeAtFrame: Crafty.frame(), z: ZINDEX.item, outdoor: tweenItem})
			.bind("TweenEnd", function(e) {
				if (tweenItem) {
					tweenItem.tween({alpha: 0.0}, 20);
				}
				this.destroy();
			})
			.bind('EnterFrame', function() {
				if (Crafty.frame() - this.lifeAtFrame == itemLife) { // one time occurs
					this.tween({alpha: 0.0}, 20);
				}
			});
			
		//var textWidth = (0.5 + itemName.length * 7.5) << 0; // hardcoding
		var textWidth = 0;
		var text = Crafty.e("2D, DOM, Text, Tween")
			.attr({w: textWidth, h: 20, w: 300, x: x * 2 - 150 + TILE_SIZE, y: y * 2, alpha: 2.0, z: ZINDEX.text})
			.textFont({family: 'SilkscreenNormal', size: '26px', weight: "bold"})
			.css({"text-align": "center"})
			.textColor("#FFFFFF")
			.tween({alpha: 0.0, y: y - 40}, 50)
			.bind("TweenEnd", function(e) {
				this.destroy();
			});
		text.text(itemObject.name);
		
		Crafty.trigger('ItemFound', {name: itemObject.key});
		
		return item;
	}
};