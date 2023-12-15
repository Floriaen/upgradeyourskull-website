/////////////////////////////////////
// Be carefull, this is a dirty code.
// Read it at your own risk
// ©floriaen 2012
//////////////////////////////////

function FoodGenerator(itemGenerator) {
	this.foodGenerated = 0;
	this.itemGenerator = itemGenerator;
	//this.foods = new Array();
};

FoodGenerator.prototype = {
	getFoods: function() {
		var list = new Array();
		Crafty("2D").each(function() {
			var cl = this.__c;
			if (cl.hasOwnProperty("food")) {
				list.push(this);
			}
		});
		return list;
	},
	
	hasFood: function(x, y) {
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
	
	generate: function(food, action) {
		this.foodGenerated++;
		//if (carrotLeft <= 0) return; //END

		var col = WIDTH / TILE_SIZE - 2;
		var row = HEIGHT / TILE_SIZE - 2;

		var i = x = y = 0;
		var stop = false;
		do {
			x = Crafty.math.randomInt(1, col - 2);
			y = Crafty.math.randomInt(1, row - 2);
			n = x + y * WIDTH / TILE_SIZE
		} while ((solidTile.indexOf(n) >= 0) || this.hasFood(x * TILE_SIZE, y * TILE_SIZE));
		
		// destroy the old:
		food = food || null;
		if (food) {
			food.destroy();
			if (action == 'infect') {
				Score.infectFood();
			} else
			if (action == 'ate') {
				Score.ateFood();
			}
			//Score.update();
		}
		
		
		this.create(x, y);
	},
	
	destroyAll: function() {
		Crafty("2D").each(function() {
			var cl = this.__c;
			if (cl.hasOwnProperty("food")) {
				this.destroy();
			}
		});
	},
	
	create: function(x, y) {
		var s = this;
		var food = Crafty.e("2D, Canvas, SpriteAnimation, food, Collision")
			.attr({
				x: x * TILE_SIZE, y: y * TILE_SIZE, z: ZINDEX.food, 
				init: 0, state: 0, contaminated: false, 
				_explodeDelay: 0,
				i: x,
				j: y
			})
			.animate("grow", 0, 1, 2)		
			.animate("contaminated", 3, 1, 3)
			.animate("explode1", 3, 1, 5)
			.animate("explode2", 6, 1, 10)
			//.collision(new Crafty.polygon([2, 2], [30, 2], [30, 30], [2, 30]))
			//.collision(new Crafty.polygon([0, 0], [TILE_SIZE, 0], [TILE_SIZE, TILE_SIZE], [0, TILE_SIZE]))
			.bind("EnterFrame", function() {
				if (food.state == 0) {
					if (!food.isPlaying("grow") && this.init == 0) {
						//this.animate("grow", 50);
						food.init = 1;
						food.animate("grow", 70, 0);
					}
				} else
				if (food.state == 1) {
					food.animate("contaminated", 1, 0);
					food.contaminated = true;
					//Score.update();
				} else
				if (food.state == 2) {
					food._explodeDelay = Crafty.frame();
					food.state = 3;
				} else 
				if (food.state == 3) {
					// waiting for 10 frames
					if ((Crafty.frame() - food._explodeDelay) >= 2) {
						food.animate("explode1", 40, 0);
						food.state = 4;
					}
				} else
				if (food.state == 4) {
					food.animate("explode2", 40, 0);
					food.state = 5;
					State.wormJustEatSomething = true;
				} else 
				if (food.state == 5) {
					if (!food.isPlaying("explode2")) {
						var x = this.x;
						var y = this.y;
						// the food is gone, a new one is generated
						s.generate(food, 'infect');
						s.itemGenerator.spawn(x, y);
						// POP an item
						
					}
				}
			});	
		return food;
	}
};