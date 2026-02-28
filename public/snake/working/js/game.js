/////////////////////////////////////
// Be carefull, this is a dirty code.
// Read it at your own risk
// ©floriaen 2012
//////////////////////////////////
var debugMode = false;

var WIDTH = 768 * 1/2; // 352
var HEIGHT = 576 * 1/2; // 256

var FOOD_COUNT = 3; // level of difficulty

// var WIDTH = 704;
// var HEIGHT = 512;

var TILE_SIZE = 32;
var MAX_SNAKE_PART = 80;
var MAX_EXPLOSIONS_COUNT = 50;
var MAX_WORMSTAIN_COUNT = 20;

var MAX_CARROT = 30;


var solidTile = new Array();
var insideRocks = new Array(); // same thing
var explosions = new Array();
var stains = new Array();

var topDoor = 0;
var bottomDoor = 0; 
var leftDoor = 0;
var rightDoor = 0;

var foodGenerator = null;

var maxItemFound = 0;

var Score = null;
var Speed = {
	WORM_SPEED: 7.0,
	SNAKE_SPEED: 2.3
};

var wormsBorn = 0;
var infestedVegetable = 0;

var State = {
	wormJustEatSomething: false,
	wormMustReborn: true
};

var ZINDEX = {
	text: 12,
	worm: 10,
	snake: 10,
	tail: 10,
	blood: 7,
	wormStain: 8,
	food: 9,
	item: 9,
	wall: 10,
	block: 10
}

var ground = {};

var firstLaunch = true;

var startTime = null;

function wipe(obj) {
	if (!obj) return;
	for (var p in obj) {
		if (obj.hasOwnProperty(p))
			delete obj[p];
	}
};

// window.onload = function() {
// Crafty.modules('http://cdn.craftycomponents.com/', { HitBox: 'release' }, 
function loadGame() {
	//start crafty
	Crafty.init(WIDTH, HEIGHT + TILE_SIZE);
	Crafty.canvas.init();
	
	Crafty.stage.elem.style.width = (WIDTH * 2) + "px";
	Crafty.stage.elem.style.height = (HEIGHT * 2) + "px";
	
	//turn the sprite map into usable components
	Crafty.sprite(TILE_SIZE, "resources/sprite.png#" + (new Date()).getTime(), {
		grass1: [0,0],
		grass2: [1,0],
		grass3: [2,0],
		grass4: [3,0],
		
		target: [4,0],
		
		food: [10,1], // empty
		commonFood: [2,1],
		infectedFood: [4 ,1],
		
		bush1: [0,2],
		bush2: [1,2],
		worm: [8,3],
		wormLife: [1, 3],
		
		
		snake: [0,7],
		snakeBody: [0,8],
		
		wormExplosion: [3, 2],
		wormStain: [5, 2]
	});
	
	Crafty.sprite(48, "resources/sprite.png#" + (new Date()).getTime(), {
		tailExplosion: [0, 6] // 288px from top
	});
	
	// Item generator:
	var itemGenerator = new ItemGenerator();
	itemGenerator.loadSprite("resources/items.png#" + (new Date()).getTime(), gameItems);
	foodGenerator = new FoodGenerator(itemGenerator);
	
	Crafty.bind("ItemFound", function(data) {
		// reinit the worm state:
		// worm.setBigger(false);
		worm.crazyControl = false;
		worm.setInvincible(false);
		
		// what to do:
		switch (data.name) {
			case 'sunflower':
			case 'flowers':
			case 'maki':
			case 'apple':
				worm.speed = Speed.WORM_SPEED; // normal speed
				break;
			
			case 'eye':
			case 'slime':
				//worm.crazyControl = true;
			break;
			
			case 'gem':
			case 'battery':
				//worm.setInvincible(true);
			break;
			
			case 'peyotl':
			case 'cloud': // fly
			case 'mushroom':
				//worm.setInvisible(true);
			break;
			
			// grave, hole are obstacle
			//case 'battery':
			case 'heartOfBlood':
			case 'wormPoop':
				worm.speed = Speed.WORM_SPEED + 1;
			break;
			
			case 'mark':
				worm.speed = Speed.WORM_SPEED * 2/3;
			case 'footprint':
				snake.enrage(); // devil mark
			break;
			
			case 'eye':
				//snake.crazyPortal();
			break;
			
			case 'cake':
			case 'chocolate': // color change
			case 'cheese':
			case 'burger':
			case 'gum': // candy mode
			case 'marshmallow':
				//worm.setBigger(true);
			break;	
		}
	});
	
	//method to randomy generate the map
	function generateWorld() {
	
		var col = WIDTH / TILE_SIZE;
		var row = HEIGHT / TILE_SIZE;

		//generate the grass along the x-axis
		for (var i = 0; i < col; i++) {
			// generate the grass along the y-axis:
			for (var j = 0; j < row; j++) {
				if (j == 5 && i == 5) {
					insideRocks.push([i, j]);
					Crafty.e("2D, Canvas, target")
						.attr({x: i * TILE_SIZE, y: j * TILE_SIZE});
				} else {
					/*
					// externalize the ground
					if (ground.hasOwnProperty(i)) {
						if (!ground.hasOwnProperty(j)) {
							ground[i][j] = Crafty.math.randomInt(1, 4);
						}
					} else {
						ground[i] = {};
						ground[i][j] = Crafty.math.randomInt(1, 4);
					}
					*/
					
					var e = i * col + j;
					if (!ground.hasOwnProperty(e)) {
						ground[e] = Crafty.math.randomInt(1, 4);
					}
					var grassType = ground[e];
					
					Crafty.e("2D, Canvas, grass" + grassType)
						.attr({x: i * TILE_SIZE, y: j * TILE_SIZE});

					//1/50 chance of drawing a carott and only within the bushes
					if(grassType != 1 && i > 0 && i < col - 1 && j > 0 && j < row - 1 && Crafty.math.randomInt(0, 100) > 98) {
						var r = Crafty.math.randomInt(0, 2);
						if (r == 1) {
							insideRocks.push([i, j]);
							Crafty.e("2D, Canvas, Block, rock, bush1, Collision")
								.attr({x: i * TILE_SIZE, y: j * TILE_SIZE, z: ZINDEX.block})
								.collision(new Crafty.polygon([0, 0], [TILE_SIZE, 0], [TILE_SIZE, TILE_SIZE], [0, TILE_SIZE]))
						} else 
						if (r == 2) {
							insideRocks.push([i, j]);
							Crafty.e("2D, Canvas, Block, hole, Collision")
								.attr({x: i * TILE_SIZE, y: j * TILE_SIZE, z: ZINDEX.block})
								
								//.collision(new Crafty.polygon([8, 8], [24, 8], [24, 24], [8, 24]))
								.collision(new Crafty.polygon([2, 2], [30, 2], [30, 30], [2, 30]))
						} else {
							//createFood(i, j);
						}
					}
				}
			}
		}
		
		var i = 0;
		for (i; i < insideRocks.length; i++) {
			var r = insideRocks[i];
			solidTile.push(r[0] + r[1] * WIDTH / TILE_SIZE);
		}

		// door
		topDoor = Crafty.math.randomInt(1, col - 2);
		bottomDoor = Crafty.math.randomInt(1, col - 2);
		leftDoor = Crafty.math.randomInt(1, row - 2);		
		rightDoor = Crafty.math.randomInt(1, row - 2);
		
		//create the bushes along the x-axis which will form the boundaries
		for (var i = 0; i < col; i++) {
			if (i != topDoor) {
				Crafty.e("2D, Canvas, Block, rock, bush"+Crafty.math.randomInt(1,2) + ", Collision")
					.collision(new Crafty.polygon([0, 0], [TILE_SIZE, 0], [TILE_SIZE, TILE_SIZE], [0, TILE_SIZE]))
					.attr({x: i * TILE_SIZE, y: 0, z: ZINDEX.wall});
			}
			
			if (i != bottomDoor) {
				Crafty.e("2D, Canvas, Block, rock, bush" + Crafty.math.randomInt(1,2) + ", Collision")
					.collision(new Crafty.polygon([0, 0], [TILE_SIZE, 0], [TILE_SIZE, TILE_SIZE], [0, TILE_SIZE]))
					.attr({x: i * TILE_SIZE, y: HEIGHT - TILE_SIZE, z: ZINDEX.wall});
			}
		}
		
		//create the bushes along the y-axis
		//we need to start one more and one less to not overlap the previous bushes
		for(var i = 1; i < row; i++) {
			if (i != leftDoor) {
				// 			// poly = new Crafty.polygon([0,0],[area._w,0],[area._w,area._h],[0,area._h]);
				Crafty.e("2D, Canvas, Block, rock, bush"+Crafty.math.randomInt(1,2) + ", Collision")
					//.collision(new Crafty.polygon([[8,8],[8,16],[16,16],[16,8]]))
					.collision(new Crafty.polygon([0, 0], [TILE_SIZE, 0], [TILE_SIZE, TILE_SIZE], [0, TILE_SIZE]))
					.attr({x: 0, y: i * TILE_SIZE, z: ZINDEX.wall});
			}
			
			if (i != rightDoor) {
				Crafty.e("2D, Canvas, Block, rock, bush"+Crafty.math.randomInt(1,2) + ", Collision")
					.collision(new Crafty.polygon([0, 0], [TILE_SIZE, 0], [TILE_SIZE, TILE_SIZE], [0, TILE_SIZE]))
					.attr({x: WIDTH - TILE_SIZE, y: i * TILE_SIZE, z: ZINDEX.wall});
			}
		}	
		
		// create the first waves of vergetable:
		var o = 0;
		while (o++ < FOOD_COUNT) {
			foodGenerator.generate();
		}
		
		
		
		
		/*
		// glasspane:
		Crafty.e("2D, DOM, Color")
			.attr({x: 0, y: 0, w: WIDTH * 2, h: HEIGHT * 2, alpha: 0, z: 1002, startFrame: 0, _step: 1 / 300, _duration: 30})
			.color("black")
			.bind("Load", function(e) {
				// (to - from) / dur
				// this._step = 1 / 300; //this._duration;
				//console.log(this._step);
			})
			.bind("ItemFound", function(e) {
				this.alpha = 0; // this res
			})
			.bind("EnterFrame", function(e) {
				
				this.alpha += this._step;
				if (this.alpha > 0.8) {
					this.alpha = 0.8;
					// this is the end right ?
					this.trigger("Night");
				}
			});
		*/
		
		// Score
		Score = {
			
			maxItemFound: 0,
			
			infectedFoodText: null,
			ateFoodText: null,
			itemFound: null,

			_life: 5,
			_infectedFood: 0,
			_ateFood: 0,	

			wormKilled: function() {
				if (this._life == 0) {
					// the game should stop
				} else {
					this._life--;
				}
				return this;
			},
			
			reset: function() {
				this._infectedFood = 0
			},

			infectFood: function() {
				this._infectedFood++;
				return this;
			},

			ateFood: function() {
				this._ateFood++;
				return this;
			},

			_drawWorms: function() {
				Crafty("2D").each(function() {
					var cl = this.__c;
					if (cl.hasOwnProperty('wormLife')) {
						this.destroy();
					}
				});

				var i = 0;
				for (i; i < this._life; i++) {
					Crafty.e("2D, DOM, wormLife")
						.attr({ x: i * 24, y: 5, w: 32});
				}
			},

			createBoard: function() {
/*
				var it = Crafty.e("2D, DOM, Text")
					.attr({ x: 310 * 2, y: 6 * 2, h: 20, w: 200, z: 1000})
					.textFont({family: 'SilkscreenNormal', size: '62px'})
					.textColor("#FFFFFF")
				it.text(MAX_CARROT);
*/
				var self = this;
				Crafty.bind("ItemFound", function(data) {
					//it.textFont({family: 'Impact', size: '20px'})
					// it.textFont({family: 'Impact', size: '16px'})
					// 			.textColor("#FFFFFF")
					// 			
					//it.text(MAX_CARROT - this._ateFood);
				});
				
				var foodEaten = function(data) {
					//it.textFont({family: 'Impact', size: '20px'})
					// it.textFont({family: 'Impact', size: '16px'})
					// 			.textColor("#FFFFFF")
					// 			
					
					var itemLeft = MAX_CARROT - (self._ateFood);
					if (itemLeft >= 0) {
						it.textFont({family: 'SilkscreenNormal', size: '62px'}).text(itemLeft);
					} else {
						
						
						// Score._infectedFood
						// it.textFont({family: 'SilkscreenNormal', size: '62px'}).text(itemLeft);
						
						
						
						if (itemGenerator.itemGenerated <= this.maxItemFound) {
							// continue the game
							self._ateFood = 0;
						} else {
							
							Crafty.unbind("EatFood", foodEaten);

							State.wormMustReborn = false;
							itemLeft = 0;
							it.alpha = 0;
							
							snake.die();
							worm.die();
							
							foodGenerator.destroyAll();
							
							Crafty.trigger("ScoreReached", "You found " + itemGenerator.maxItemGenerated + " items");
						}
					}
				};
				
				//Crafty.bind("EatFood", foodEaten);

				return this;
			},

			update: function() {
				return;
				// Score
		//		this.ateFoodText.text(this._ateFood);
				this.infectedFoodText.text("x " + this._infectedFood);
				this.ateFoodText.text("x " + this._ateFood);
				return this;	
			}

		};	
	}
	
	Crafty.bind("wormIsDead", function() {
		if (itemGenerator.itemGenerated > maxItemFound) {

			maxItemFound = itemGenerator.itemGenerated;
			
			snake.die();
			worm.die();
			
			foodGenerator.destroyAll();
			
			Crafty.trigger("ScoreReached", "You found " + itemGenerator.itemGenerated + " items");
			
			
			// display the panel
		} else {
			worm = getNewWorm();
		}
	});

	function explode(tailBody, handler) {
		// add extra x and y
		var x = tailBody.x + Crafty.math.randomInt(-2, 2);
		var y = tailBody.y + Crafty.math.randomInt(-2, 2);
		
		var explosion = Crafty.e("2D, Canvas, Persist, tailExplosion, SpriteAnimation, explosion")
			.attr({x: x, y: y, z: ZINDEX.blood, exploded: 0, part: tailBody.part, explosionNameAnimation: null})
			.animate("explode1", 0, 6, 6)
			.animate("explode2", 0, 6, 7)		
			.bind("EnterFrame", function() {
				if (this.exploded == 0) {
					this.exploded = 1;
					// choose the animation:
					this.explosionNameAnimation = 'explode' + Crafty.math.randomInt(1, 2);
					this.animate(this.explosionNameAnimation, 23, 0);
				}
				
				if (!this.isPlaying(this.explosionNameAnimation) && this.exploded == 1) {
					this.exploded = 2;
				}
				
				if (handler) {
					handler();
				}
			});
			
		// Remove old explosions:	
		explosions.push(explosion);
		if (explosions.length > MAX_EXPLOSIONS_COUNT) {
			var explotionToRemove = explosions.shift(); // remove the first element
			if (explotionToRemove) {
				explotionToRemove.destroy();
			}
		}
	};
	
	//the loading screen that will display while our assets load
	Crafty.scene("loading", function() {
		//load takes an array of assets and a callback when complete
		Crafty.load(["resources/toolbar.png", "resources/innerShadow.png", "resources/sprite.png", "resources/items.png"], function() {

			var glassPane = document.createElement("div");
			glassPane.className = "shadow";
			// glassPane.style.width = "766px";
			// glassPane.style.height = "574px";
			document.getElementById("cr-stage").appendChild(glassPane);
			// 
			Crafty.scene("menu"); //when everything is loaded, run the main scene
		});
		
		Crafty.load(["resources/innerShadow.png"])
		
		//black background with some loading text
		Crafty.background("#000");
		Crafty.e("2D, DOM, Text").attr({x: 0, y: 154, w: WIDTH * 2, h: 20})
			//.textFont({family: 'SilkscreenNormal', size: '33px'})
			.css({fontFamily: 'SilkscreenNormal', fontSize: '33px', "text-align": "center"})
			.textColor("#FFFFFF")
			.text("Loading");
	});
	
	// automatically play the loading scene
	Crafty.scene("loading");

	Crafty.scene("menu", function() { 
		var letters = "BCDSSSFGHSJKLSSMNSPQRSTVWSSSSXYZ"
		var idx = Crafty.math.randomInt(0, letters.length - 1);
		var l = letters[idx];
		// use of CSS instead of textFont to be able to have different font size:
		// https://groups.google.com/forum/?fromgroups#!topic/craftyjs/0Ay_FYyn2cU
		Crafty.e("2D, DOM, Text").attr({x: 0, y: 84, w: WIDTH * 2, h: 20})
			//.textFont({family: 'SilkscreenNormal', size: '38px'})
			.css({fontFamily: 'SilkscreenNormal', fontSize: '50px', "text-align": "center"})
			.textColor("#FFFFFF")
			.text(l + "NAKE");
		
		var item = itemGenerator.getRandomItem().key;
		//console.log(item);	
		Crafty.e("2D, Canvas, " + item).attr({x: (WIDTH - 32) / 2, y: 84, w: 32, h: 32});
		
		Crafty.e("2D, DOM, Text").attr({x: 0, y: 300, w: WIDTH * 2, h: 20})
			//.textFont({family: 'SilkscreenNormal', size: '38px'})
			.css({fontFamily: 'SilkscreenNormal', fontSize: '24px', "text-align": "center"})
			.textColor("#FFFFFF")
			.text("Press any key to start");

		Crafty.e("2D, DOM, Text").attr({x: 0, y: 360, w: WIDTH * 2, h: 20})
				//.textFont({family: 'SilkscreenNormal', size: '20px'})
			.css({fontFamily: 'SilkscreenNormal', fontSize: '18px', "text-align": "center", "color": "pink"})
			.text("-<br /><h4>How to play?</h4><p>Find as more items as you can<br /> by infecting the carrots</p>");
		
			
		var launchGame = function() {
			Crafty.unbind("KeyDown", launchGame);
			Crafty.scene("main");
		};
		Crafty.bind("KeyDown", launchGame);		
	});
	
	Crafty.scene("main", function() {
		
		startTime = (new Date()).getTime() / 1000;
		
		if (firstLaunch) {
			firstLaunch = false;
			Crafty.e("2D, DOM, Tween, Color")
				.attr({x: 0, y: 0, w: WIDTH * 2, h: HEIGHT * 2, alpha: 1, z: 20})
				.color("black")
				.bind("TweenEnd", function(e) {
					this.destroy();
				})
				.tween({"alpha": 0}, 15);
		}
		
		wipe(Score);
		// init state
		State.wormJustEatSomething = false;
		State.wormMustReborn = true;

		generateWorld();
		
		//Score._ateFood = 0;
		Score.createBoard();

		Crafty.c("Alert", {
			
			_display: false,
			_text: "",
			
			init: function() {
				var self = this;
				Crafty.bind("ScoreReached", function(text) {
					self._text = text;
					self._display = true;
				});
			},
			
			getText: function() {
				return this._text;
			},
			
			displayed: function() {
				this._display = false;
			},
			
			display: function() {
				return this._display;
			},
		
			hidden: function() {
				this._display = true;
			},
		});
		
		Crafty.e("2D, DOM, Color, Tween, Alert")
			.attr({x: 0, y: (HEIGHT * 2 - 150) / 2, w: WIDTH * 2, h: 150, alpha: 0, messageText: null, spaceText: null})
			.color("#000000")
			.bind("KeyDown", function(e) {
				if (e.key == Crafty.keys['SPACE']) {
					this.messageText.destroy();
					this.spaceText.destroy();
					// this.destroy();
					// this.hidden();
					this.alpha = 0;
					
					Crafty.scene("main");
					
				}
			})
			.bind("TweenEnd", function(e) {
				
				this.messageText = Crafty.e("2D, DOM, Text")
					.attr({x: this.x, y: this.y + 20, w: this.w, h: this.h})
					.textFont({family: 'SilkscreenNormal', size: '30px'})
					.textColor("#FFFFFF")
					.css({"text-align": "center"})				
					.text(this.getText());
					
				this.spaceText = Crafty.e("2D, DOM, Text")
					.attr({x: this.x, y: this.y + 60, w: this.w, h: this.h})
					.textFont({family: 'SilkscreenNormal', size: '30px'})
					.textColor("#FFFFFF")
					.css({"text-align": "center"})		
					//.text("Hit space and play again");
					.text("Hit space and lower your highest score!")
					
					
				// send the stats:
				var endTime = (new Date()).getTime() / 1000;
				// TODO
				StatisticsSender.getInstance().send(itemGenerator.itemGenerated, foodGenerator.foodGenerated, startTime, endTime);
			})
			.bind("EnterFrame", function() {
				if (this.display()) {
					this.displayed();
					this.tween({"alpha": 0.7}, 20);
				}
				
				if (this.spaceText) {
					if (Crafty.frame() % 10 === 0) {
						if (this.spaceText.alpha === 0) {
							this.spaceText.alpha = 1;
						} else {
							this.spaceText.alpha = 0;
						}
					}
				}
			});

		Crafty.c("tail", {
			_previousTeniaPart: null,
			_detached: false,
			
			attach: function(previousTeniaPart) {
				this._previousX = previousTeniaPart.x;
				this._previousY = previousTeniaPart.y;
				// add a reference to the previous part
				// could be null
				this._previousTeniaPart = previousTeniaPart;
				return this;
			},
			detach: function(handler) {
				if (!this._detached) {
					this._detached = true;
					explode(this, handler);
				}
				return this;
			}
		});
		
		Crafty.c('SnakeHead', {

			positions: new Array(),

			free: true,

			tail: new Array(),

			path: null,

			_speed: Speed.SNAKE_SPEED,
			_stop: false,
			_rx: 0,
			_ry: 0,
			startIndex: 0,

			_eatFood: null,
			_lastTeniaPart: null,

			_maskC: null,

			_direction: {
				right: false,
				left: false,
				top: false,
				bottom: false
			},

			init: function() {
				this.bind("TweenEnd", function() {
					this._speedNotReached = false;
				});
			},

			die: function() {
				while (this.tail.length >= 1) {
					this.detachBody();
				}
				this.destroy();
			},

			setSpeed: function(speed) {
				if (this._speedNotReached === false) {
					this._speed = speed;
				}
			},

			getSpeed: function() {
				return this._speed;
			},

			stop: function() {
				// tween over the speed
				this._speedNotReached = true;
				this._speed = 0; // TW
			},

			enrage: function() {
				this._isEnraged = true;
			},

			calm: function() {
				this._isEnraged = false;
			},

			isEnraged: function() {
				return this._isEnraged;
			},

			_getIndexDiff: function() {
				var s = this._speed;
				if (!this._indexDiffs.hasOwnProperty(s)) {
					var gap = 20;
					var startIndex = 0;
					var lx = snake.positions[0].x;
					var ly = snake.positions[0].y;
					do {
						p = snake.positions[startIndex++];
						if (p) {
							// get back the point we need:
							distance = Math.sqrt(Math.pow((lx - p.x), 2) + Math.pow((ly - p.y), 2));
						} else {
							// p = snake.positions[startIndex];
							break;
						}
					} while (startIndex < snake.positions.length && !((distance >= (gap - 1)) && (distance <= (gap + 1))));
				}
			},

			attachBody: function() {
				var tp = this.tail.length;
				if (this.tail.length >= MAX_SNAKE_PART) {
					// do nothing
					return this;
				}

				var startIndex = Math.max(0, snake.positions.length);
				if (this._lastTeniaPart == null) {
					this._lastTeniaPart = this; // the beast
					startIndex--;
				} else {
					startIndex = this._lastTeniaPart.startIndex;
				}			 

				var p = snake.positions[startIndex - 1];

				if (!p) {
					p = {
						x: snake.x,
						y: snake.y
					};
					//startIndex--;
				}

				var tail = Crafty.e("2D, Canvas, tail, SpriteAnimation, snakeBody, Collision")
				//	.animate('go_vertical', 1, 8, 1)
				//	.animate('go_horizontal', 0, 8, 0)
					.animate('tail', 0, 8, 1)
					.attach(this._lastTeniaPart)
					.attr({
						part: this.tail.length,
						x: p.x, 
						y: p.y,
						lastTeniaSpeed: snake.speed,
						startIndex : startIndex - 1, //newStartIndex,
						z: MAX_SNAKE_PART - this.tail.length					
					})	
					//.collision(new Crafty.circle(TILE_SIZE/2, TILE_SIZE/2, TILE_SIZE/2))

				//	.collision(new Crafty.polygon([[2, 2],[30, 2],[30, 30],[2, 30]]))
					.bind("EnterFrame", function() {
						//this.animate('tail', 20);
						var toPoint = snake.positions[this.startIndex];
						if (toPoint) {
							var diffX = this.x - toPoint.x;
							var diffY = this.y - toPoint.y;

							if (diffX < 0) {
								this.x = Math.min(toPoint.x, this.x + snake.speed);
							} else 
							if (diffX > 0) {
								this.x = Math.max(toPoint.x, this.x - snake.speed);
							}

							if (diffY < 0) {
								this.y = Math.min(toPoint.y, this.y + snake.speed);
							} else 
							if (diffY > 0) {
								this.y = Math.max(toPoint.y, this.y - snake.speed);
							}
						}	
					})
					.bind("tailIncrement", function() {
						this.startIndex++;
					});	

				this.tail.push(tail);
				this._lastTeniaPart = tail;

				return this;
			},

			detachBody: function() {
				snake.free = false;
				var lastTeniaPart = this.tail.pop();
				this._lastTeniaPart = this.tail[this.tail.length - 1];
				if (lastTeniaPart == null) {
					snake.free = true;
				} else {
					//console.log('explode ', snake.tail.length)
					lastTeniaPart.detach(function() {
						snake.free = true;
					});
					lastTeniaPart.destroy();
				}
				return this;
			}
		});
		
		snake = Crafty.e("2D, Canvas, Moveable, SnakeHead, SpriteAnimation, Collision, snake")
			.attr({
				x: TILE_SIZE, y: TILE_SIZE, z: MAX_SNAKE_PART + 1, speed: Speed.SNAKE_SPEED,
				fromPoint : [0, 0],
				toPoint : [0, 0],
				gap : [0, 0]
			})
			.bind("EnterFrame", function(e) {	
				
				//return;
				
				if (this.isLeft()) {
					this.sprite(1, 7, 1, 1);
				} else
				if (this.isRight()) {
					this.sprite(2, 7, 1, 1);
				} else
				if (this.isTop()) {
					this.sprite(3, 7, 1, 1);
				} else {
					this.sprite(0, 7, 1, 1);
				}
							
				//return;
				var direction = null;
				var snakeAnimationSpeed = 30;
			
				// https://github.com/qiao/PathFinding.js
				if (this._stop == false) {
					
					var w = (WIDTH / TILE_SIZE + 0.5) << 0; 
					var h = (HEIGHT / TILE_SIZE + 0.5) << 0;

					// GRID -- TODO create the grid out of the loop and clone it here:
					var j = k = 0;
					var map = new Array();
					// create the map:
					for (j; j < h; j++) {
						map[j] = new Array();
						for (k = 0; k < w; k++) {
							var solid = 0;
							if ((j == 0 || j == h - 1) || (k == 0 || k == w - 1) || (j == 5 && k == 5)){
								solid = 1;
							}
							map[j][k] = solid;
						}
					}
					
					var b = 0;
					for (b; b < insideRocks.length; b++) {
						map[insideRocks[b][1]][insideRocks[b][0]] = 1;
					}

					// take care about the snail:
					var p = 0;
					for (p; p < snake.tail.length; p++) {
						solidI = (snake.tail[p].x / TILE_SIZE + 0.5) << 0;
						solidJ = (snake.tail[p].y / TILE_SIZE + 0.5) << 0;
						map[solidJ][solidI] = 1;
					}

					var grid = new PF.Grid(w, h, map); 
				    var finder = new PF.BreadthFirstFinder();

					var fromX = (snake.x / TILE_SIZE + 0.5) << 0;
					var fromY = (snake.y / TILE_SIZE + 0.5) << 0; 

					var toX = (worm.x / TILE_SIZE + 0.5) << 0;
					var toY = (worm.y / TILE_SIZE + 0.5) << 0;

					// goal
					var pad = 0;//1;
					var goal = (this.x + pad) >= this.toPoint[0];
					goal = goal && (this.x - pad) <= this.toPoint[0];
					goal = goal && (this.y + pad) >= this.toPoint[1];
					goal = goal && (this.y - pad) <= this.toPoint[1];
					
					
					if (this.toPoint[0] == 0 || goal) {
						this.speed = Speed.SNAKE_SPEED;
						// the snake let the worm does what it wants
						if (worm.isInvisible() || worm.isInvicible()) {
							this.path = [];
						} else {
							if (worm.isDied === true) {
								this.calm(); // enrage down
							} 
							
							var MAX_SNAKE_WORM_VISION = 6;
							var MAX_SNAKE_WORM_BLINDNESS = 10;
							// something set to add some level difficulty
							var snakeWormBlindness = 5;
							var snakeWormVision = 3 + (0.5 + itemGenerator.itemGenerated / 32) << 0;
							if (snakeWormVision > MAX_SNAKE_WORM_VISION) { // max
								snakeWormBlindness = snakeWormBlindness + (snakeWormVision - MAX_SNAKE_WORM_VISION); // the diff
								if (snakeWormBlindness > MAX_SNAKE_WORM_BLINDNESS) {
									snakeWormBlindness = MAX_SNAKE_WORM_BLINDNESS
								}
								snakeWormVision = MAX_SNAKE_WORM_VISION;
							}
								
							// where is the worm?
							this.path = finder.findPath(fromX, fromY, toX, toY, grid);
							if (this.isEnraged()) {
								// speed and kill!
								this.speed = Speed.SNAKE_SPEED * 2; // tween ?
							} else						
							if (this.path.length > 0 && (this.path.length <= snakeWormVision || State.wormJustEatSomething) && worm.isDied == false) {
								this.speed = Speed.SNAKE_SPEED * 2;//SNAKE_SPEED;
								// if the worm is too far the snake stop to purchase it:
								if ((State.wormJustEatSomething && this.path.length >= snakeWormBlindness + 2) || this.path.length >= snakeWormBlindness) {
									State.wormJustEatSomething = false;
									this.speed = Speed.SNAKE_SPEED;
									this.path = [];
								}
							} else {
								this.speed = Speed.SNAKE_SPEED;
								this.path = [];
							}
						}
						
						// no path is found, we try to go to food instead
						if (this.path && this.path.length == 0) {
							// try to go to the nearest food:
							var foods = foodGenerator.getFoods();
							var f = 0;

							while (this.path.length == 0 && f < foods.length) {
								var toX = (foods[f].x / TILE_SIZE + 0.5) << 0;
								var toY = (foods[f].y / TILE_SIZE + 0.5) << 0;

								var grid = new PF.Grid(w, h, map); 
								this.path = finder.findPath(fromX, fromY, toX, toY, grid);
								f++;
							}
						}

						if (this.path && this.path.length > 0) {
							var nextPoint = this.path[1];
						    if (nextPoint) {

								this.fromPoint = [this.x, this.y];
								this.toPoint = [nextPoint[0] * TILE_SIZE, nextPoint[1] * TILE_SIZE];
								
								this.positions.push({
						            x: this.toPoint[0],
					                y: this.toPoint[1],
					                direction: null
					            });
					
								// TODO ensure the array will not be to big
								// array.slice(0, 500)
					
					
								Crafty.trigger('tailIncrement');
							}
						} else {
							if (this.free) {
								this.free = false;
								this.detachBody();
							}
						}
					} else {
						this.fromPoint = [this.x, this.y];
					}

					var newX = this.x, newY = this.y; // set the new points
					var diffX = this.x - this.toPoint[0];
					var diffY = this.y - this.toPoint[1];

					if (diffX < 0) {
						newX = Math.min(this.toPoint[0], this.x + this.speed);
					} else 
					if (diffX > 0) {
						newX = Math.max(this.toPoint[0], this.x - this.speed);
					}
					
					if (diffY < 0) {
						newY = Math.min(this.toPoint[1], this.y + this.speed);
					} else 
					if (diffY > 0) {
						newY = Math.max(this.toPoint[1], this.y - this.speed);
					}
					// from Moveable entity
					this.setNewPosition(newX, newY);
				}
			})
			.onHit("worm", function() {
				worm.die();
			})
			.onHit("food", function(obj) {
				if (!snake._eatFood) {
					var food = obj[0].obj;
					if (food.state < 2) {
						snake.attachBody();
						foodGenerator.generate(food, 'ate');
						snake._eatFood = null;
						Crafty.trigger("EatFood", null);
					}
					
				}
			});
		
		//create our worm entity with some premade components //SolidHitBox
		worm = getNewWorm();		
		
	});

	function getNewWorm() {
		// reinit the inventory
		itemGenerator.reset();
		foodGenerator.foodGenerated = 0; // reset too
		Score.reset();

		wormsBorn++;
		// Score.update();
		
		
		var colors = ["#ff4b46", "#3cc8cb", "#ff4b46", "#f9db44", "#3cc8cb", "#f9db44"];
		var idx = 0;
		function colorChanger() {
			if (Crafty.frame() % 10 === 0) {
				if (++idx >= colors.length) {
					idx = 0;
				}
				// change
				var c = colors[idx];
				this.mask(c, 0.5);
			}
		};
		
		
		return Crafty.e("2D, Canvas, Mask, Keyboard, Moveable, Tween, Worm, SpriteAnimation, Collision, worm")
			.attr({x: 5 * TILE_SIZE, y: 5 * TILE_SIZE, w: TILE_SIZE, h: TILE_SIZE, z: ZINDEX.worm, _active: true, invincible: true})
			.Worm(Speed.WORM_SPEED)
			.setBigger(Crafty.math.randomInt(0, 1) == 1)
			//.Mask("worm")
			.animate("wormExplosionAnimation", 3, 2, 5)
			.animate("falling", 7, 2, 9)
		
			.animate("horizontalWalk", 6, 3, 8)
			.animate("verticalWalk", 0, 3, 2)
			.animate("waiting", 1, 3, 2)
			
			.animate("bigHorizontalWalk", 6, 5, 8)
			.animate("bigVerticalWalk", 0, 5, 2)
			.animate("bigWaiting", 1, 5, 2)
		
			.animate("bringToFire", 0, 9, 1)
			.animate("burn", 1, 9, 3)
			
			// .animate("vertical_waiting",3, 3, 4)	
		
			.animate("contaminating", 12, 3, 15)
			.bind("WormVisibilityHasChanged", function(e) {
				if (this.isInvisible()) {
					this.tween({alpha:0.4}, 10);
				} else {
					this.alpha = 1.0;
				}
			})
			.bind("InvicibleStateHasChanged", function(e) {

				if (this.isInvicible()) {	
					this.bind("EnterFrame", colorChanger);
				} else {
					this.mask("#000000", 0); // TODO: reset the mask
					this.unbind("EnterFrame", colorChanger);
				}
			})
			.bind("EnterFrame", function(e) {
				if (this.isDied) {
					if (!this.isPlaying(this._dyingAnimation)) {
						this._dying = false;
						var oldWorm = worm;
						
						Crafty.trigger("wormIsDead");
						
						
						var gapX = Crafty.math.randomInt(-2, 2);
						var gapY = Crafty.math.randomInt(-2, 2);
						
						// create in place of this old one the stain:
						var stain = Crafty.e("2D, Canvas, wormStain, Persist")
							.attr({x: oldWorm.x + gapX, y: oldWorm.y + gapY, z: ZINDEX.wormStain});
						if (Crafty.math.randomInt(0, 1) === 1) {
							stain.flip("X");
						}
						if (Crafty.math.randomInt(0, 1) === 1) {
							stain.flip("Y");
						}

						// Remove old stains:	
						stains.push(stain);
						if (stains.length > MAX_WORMSTAIN_COUNT) {
							var stainToRemove = stains.shift(); // remove the first element
							if (stainToRemove) {
								stainToRemove.destroy();
							}
						}
						// remove the old one:
						oldWorm.destroy();
					}
					return;
				}
				if (this._dying) {
					this._disableControl = true;
					if (!this.isPlaying(this._dyingAnimation) && this.isDied == false) {
						this.animate(this._dyingAnimation, 20, 0);
					}
				
					this.isDied = true;
					return;
				}

				var collision = this.hit("food");
				if (collision) {
					var food = collision[0].obj;
					var zx = food.x + 6;
					var zy = food.y + 6;
				
					var zone = new Crafty.polygon([zx, zy], [zx + 20, zy], [zx + 20, zy + 20], [zx, zy + 20]);
					//debugger;
					if (zone.containsPoint(this.x + 16, this.y + 16)) {
						// transform the carrot:
						if (food.state == 0) {
							
							this.setInvisible(false);
							this.setInvincible(false);
							
							this.x = food.x;
							this.y = food.y;
							this._disableControl = true;
							this.animate("contaminating", 20, 0);
							food.state = 1;
							return;
						} else {
							if (!this.isPlaying("contaminating")) {
								//this.animate("vertical_waiting", 20);
								this._disableControl = false;
								food.state = 2;
							} else {
								this.x = food.x;
								this.y = food.y;
								return;
							}
						}
					}
				}
					
				var hWalk = (this.isBig()) ? "bigHorizontalWalk": "horizontalWalk";
				var vWalk = (this.isBig()) ? "bigVerticalWalk": "verticalWalk";
							
				if (this.isLeft()) {
					this.invincible = false;
				    if (!this.isPlaying(hWalk)) {
						//this.flip('Y');
						this.stop().animate(hWalk, 10, -1);
					}				    	
				} else
				if (this.isRight()) {
					this.invincible = false;
					
				    if (!this.isPlaying(hWalk)) {
						this.flip('Y');
						this.stop().animate(hWalk, 10, -1);
					}
				    	
				} else
				if (this.isTop()) {
					this.invincible = false;
					this.flip('X');
				    if (!this.isPlaying(vWalk))
				    	this.stop().animate(vWalk, 10, -1);
				} else
				if (this.isBottom()) {
					this.invincible = false;
				    if (!this.isPlaying(vWalk))
				    	this.stop().animate(vWalk, 10, -1);
				} else {
					// don't stop animation
					if (this.isBig()) {
						//this.flip('Y');
						this.animate("bigWaiting", 20);
					} else {
						this.flip('Y');
						this.animate("waiting", 20);
					}
					
				}
			
				// Doors:
				if (this.crazyPortal) {
					if (this.y <= 0) {
						this.x = WIDTH;
						this.y = rightDoor * TILE_SIZE;											
					} else 
					if (this.y >= HEIGHT) {
						this.x = 0;
						this.y = leftDoor * TILE_SIZE;
					} else
					if (this.x <= 0) {
						this.x = topDoor * TILE_SIZE;
						this.y = 0;
					} else 
					if (this.x >= WIDTH) {
						this.x = bottomDoor * TILE_SIZE;
						this.y = HEIGHT;
					}
				} else {
					if (this.y < 0 && this.isTop()) {
						this.x = this.toX = bottomDoor * TILE_SIZE;
						
						this.y = HEIGHT;
						this.toY = HEIGHT - TILE_SIZE;
					} else
					if (this.y >= HEIGHT && this.isBottom()) {
						this.x = this.toX = topDoor * TILE_SIZE;
						
						this.y = 0 - TILE_SIZE;
						this.toY = 0;
					} else
					if (this.x <= 0 && this.isLeft()) {
						this.x = this.toX = WIDTH;
						this.y = this.toY = rightDoor * TILE_SIZE;
					} else 
					if (this.x >= WIDTH && this.isRight()) {
						this.x = this.toX = 0;
						this.y = this.toY = leftDoor * TILE_SIZE;
					}
				}	
			})			
			.collision(new Crafty.polygon([[12, 12],[20, 12],[20, 20],[12, 20]]))
			//.collision()
			.onHit("tail", function() {			
				// TODO, redefine this
				if (this.invincible == false) {
					this.die();
					State.wormJustEatSomething = false;
				}
			})			
			.onHit("Block", function(e) {
				this.collide(e[0].obj);
			})
			.onHit("portal", function(e) {
				var portal = e[0].obj;
				if (this.x === this.toX) {
					// go to the other portal:
					this.x = this.toX = portal.outdoor.x;
					this.y = this.toY = portal.outdoor.y;
					
				}
			})
	}
};