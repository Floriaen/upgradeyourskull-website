var js = [
	"js/ext/underscore.js",
	"js/ext/crafty.js",
	//"js/ext/hammer.js",
	"js/ext/Stats.js",
	
	
	"js/components/Hammer.js",
	
	"js/components/CommonText.js",
	
	"js/components/Globule.js",
	"js/components/GlobuleFactory.js",
	"js/components/HeartMassage.js",
	"js/components/Heart.js",
	"js/components/Artery.js",

	"js/components/Oriented.js",
	"js/components/Plateformer.js",
	"js/components/VampireMovement.js",

	"js/components/Life.js",

	"js/components/DelayConsumer.js",

	"js/components/ext/TileLevelImporter.js",


	"js/utils/Tilemap.js"
	
];

// LOADER
window.onload = function() {
	head(launchExperiment);
	for (i = 0; i < js.length; i++) {
		head.ready(i, console.log(js[i] + " is loading"));
		head.js({i: js[i]});
	}
};


var ENTITIES = {};
function launchExperiment()	{

	var debug = true;
	if (debug) {
		var stats = new Stats();
		stats.getDomElement().style.position = 'absolute';
		stats.getDomElement().style.left = '0px';
		stats.getDomElement().style.top = '0px';

		document.body.appendChild(stats.getDomElement());

		setInterval( function () {
			stats.update();
		}, 1000 / Crafty.timer.getFPS() );
	}

	// iphone size ratio 1.5
	var WIDTH = 288;// 300
	var HEIGHT = 480;//450;
	var TILE_SIZE = 64;
	var SEED = (new Date()).getTime();
	
	var SPRITES = {
		heart: "resources/sprite/heart.png",
		bat: "resources/sprite/bat.png",
		vampire: "resources/sprite/vampire2.png",

		worm: "resources/sprite/worm.png",
		common: "resources/sprite/common.png",

		level1: "work/pickleTiles_resize.png"
	};

	var TILEMAP = {
		level1: "resources/map.json"
	};
	
	Crafty.init(WIDTH, HEIGHT);
	//Crafty.canvas.init();
	
	Crafty.scene("Loading", function() {
		//Crafty.background("#40271d");
		// Crafty.background("#1A0D08");
		Crafty.background("#003153");
		
		Crafty.e("2D, DOM, Text").attr({x: 0, y: 100, w: WIDTH, h: 100})
			.css({"fontFamily": "SilkscreenNormal", "fontSize": "30px", "text-align": "center", "color": "white"})
			.text("Loading");
		
		// load all the sprites:
		var sprites = [];
		for (var key in SPRITES) {
			sprites.push(SPRITES[key]);
		}

		Crafty.load(sprites, function() {
			Crafty.scene("Game"); // MainScreen
		});
	});
	
	Crafty.scene("MainScreen", function() {
		Crafty.sprite(100, 150, SPRITES.heart + "#" + SEED, {"HeartSprite": [3, 0]});
		Crafty.e("2D, DOM, SpriteAnimation, HeartSprite")
			.attr({
				x: (Crafty.viewport.width - 100) / 2 , 
				y: (Crafty.viewport.height - 150) / 2
			})
			.animate("beat", 0, 0, 2)
			.animate("beat", 20, -1);

		Crafty.e("CommonText").attr({x: 0, y: 60, w: WIDTH, h: 100}).write("Beat to Start");

		Crafty.e("CommonText").attr({x: 0, y: 340, w: WIDTH, h: 100})
			.textSize(20)
			.write("Burn all the graves</br>becomes the master of the hell");

		var launchGame = function() {
			Crafty.unbind("KeyDown", launchGame);
			Crafty.scene("Game");
		};
		Crafty.bind("KeyDown", launchGame);
	});

	Crafty.scene("Game", function() {
		// Crafty.e("Artery").attr({x: 0, y: 0, w: WIDTH, h: HEIGHT}).createGlobules(20);
		window.onblur = function() {
			Crafty.pause();
		};

		window.onfocus = function() {
			Crafty.pause();
		};

		var Map = {
			isGround: function(tileIdx) {
				var t = tileIdx;
				var isGround = _.find([0, 2, 4, 6, 8, 10, 12, 14], function(num){ return num == tileIdx; });
				return (isGround);
			}
		}

		// Sprite
		Crafty.sprite(48, SPRITES.level1 + "#" + SEED, 
			{
				"CavernTileset0": [0, 0],
				"CavernTileset1": [1, 0],
				"CavernTileset2": [2, 0],
				"CavernTileset3": [3, 0],
				"CavernTileset4": [4, 0],
				"CavernTileset5": [5, 0],
				"CavernTileset6": [6, 0],
				"CavernTileset7": [7, 0],
				"CavernTileset8": [8, 0],
				"CavernTileset9": [9, 0],
				"CavernTileset10": [10, 0],
				"CavernTileset11": [11, 0],
				"CavernTileset12": [12, 0],
				"CavernTileset13": [13, 0],
				"CavernTileset14": [14, 0],
				"CavernTileset15": [15, 0]

			}
		);
		Crafty.sprite(48, SPRITES.bat + "#" + SEED, {"Bat": [0, 0]});
		Crafty.sprite(48, SPRITES.worm + "#" + SEED, {"Worm": [0, 0]});
		Crafty.sprite(48, SPRITES.common + "#" + SEED, 
			{
				"BloodPotion": [0, 0],
				"Decorum": [1, 0]
			}
		);

		Crafty.sprite(48, SPRITES.vampire + "#" + SEED, {"Vampire": [0, 0]});


		/*
		Crafty.sprite(2500, "resources/test.png" + "#" + SEED, {
			"map": [0, 0]
		});
		Crafty.e("2D, DOM, map");
		*/

		//Crafty.e("TiledLevel").tiledLevel(TILEMAP.level1, "2D");

		// function create the map
		

		
		var tileMap = new Tilemap();
		tileMap.onload = function() {

			var level = this.data["layers"][0];
			var map = level.data;
		
			var r = 0;//
			for (var i = 0; i < map.length; i++) {
				var c = (i % level.width);
				var l = map[i];
				if (l > 0) {
					l = l - 1;
					if (l <= 15) {
						var comp = (Map.isGround(l)) ? ", Ground, Block": ", Block";

						///Crafty.sprite(48, SPRITES.level1 + "#" + SEED, {"CavernTileset": [0, 0]});
						//Crafty.c("Sprite" + l)

						if (l != 15) {
							Crafty.e("2D, DOM, Collision, CavernTileset" + l + comp)
								.attr({x: c * 48, y: r * 48, w: 48, h: 48})
								//.sprite(l, 0, 1, 1)
								.collision(new Crafty.polygon([0, 0],[0, 48],[48, 48],[48, 0]));
						} else {
							// no collision on block
							Crafty.e("2D, DOM, Collision, CavernTileset" + l)
								.attr({x: c * 48, y: r * 48, w: 48, h: 48})
						}
					} else {
						if (l == 16) {
							//console.log("BloodPotion");
							Crafty.e("2D, DOM, Collision, BloodPotion")
								.attr({x: c * 48, y: r * 48, w: 48, h: 48})
								.collision(new Crafty.polygon([15, 21],[33, 21],[33, 48],[15, 48]));
						} else {
							if (l == 17) {
								Crafty.e("2D, DOM, Collision, Decorum, SpriteAnimation, Grave")
								.attr({x: c * 48, y: r * 48, w: 48, h: 48})
								.sprite(l - 16, 0, 1, 1)
								.animate("burning", 3, 0, 9)
								.collision(new Crafty.polygon([15, 21],[33, 21],[33, 48],[15, 48]));	
							} else {
								//console.log("decorum: " , l - 16);
								Crafty.e("2D, DOM, Collision, Decorum")
									.attr({x: c * 48, y: r * 48, w: 48, h: 48})
									.sprite(l - 16, 0, 1, 1)
									.collision(new Crafty.polygon([15, 21],[33, 21],[33, 48],[15, 48]));	
							}
						}
					}
				}
				if (i >= level.width && c == 0) r++;
			}
		};
		tileMap.load(TILEMAP.level1);

		// workaround @see https://groups.google.com/forum/?fromgroups#!topic/craftyjs/Z8-1ql1cDOc
		Crafty.map.boundaries = function() {
			return {
				max: { x: 50 * 48, y: 50 * 48 },
				min: { x: 0, y: 0 }
			};
		}

		
		// function create the vampire
		ENTITIES["vampire"] = Crafty.e("2D, DOM, Vampire, VampireMovement, Plateformer")
			.attr({x: 0, y: 0, w: 48, h: 48})
			.vampireMovement(3, 15)
			.plateform("Block");
			//.multiway(3, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180});

		//ENTITIES["vampire"].addComponent("Plateformer")

		// 48 x 48
		// 34 x 19
		// -------
		// 14 - 18
		// 7 - 9

		ENTITIES["vampire"].addComponent("Keyboard, Oriented").bind("KeyDown", function() {
			if (this.isDown("RIGHT_ARROW")) {
				this.go("right");
			} else
			if (this.isDown("LEFT_ARROW")) {
				this.go("left");
			}

		});


		// 41 - 35
		// 6 - 12
		// ------
		// 3 - 6
		
/*

		ENTITIES["vampire"].addComponent("Gravity").gravity("Ground").gravityConst(0.6);
		ENTITIES["vampire"].addComponent("SpriteAnimation")
			.animate("walking", 0, 0, 5)
			.animate("jumping", 0, 0, 3)

			.animate("flying", 0, 1, 2);
			
		ENTITIES["vampire"].addComponent("Collision").collision(new Crafty.polygon([7, 9],[41, 9],[41, 48],[7, 48]));
		ENTITIES["vampire"].bind("Change", function() {
			if (!this.isPlaying("walking")) {
				this.animate("walking", 20, 0);
			}
		});

		ENTITIES["vampire"].bind("KeyUp", function(e) {
			 if(e.key == Crafty.keys['UP_ARROW']) {
			 	this.gravity();
			 	this.stopConsume();
			 }
		});



		ENTITIES["vampire"].addComponent("DelayConsumer").delayConsume(20)
			.bind("Consume", function() {
				ENTITIES["Life"].decreaseLife();
			});

		ENTITIES["vampire"].bind("FlyingRequest", function() {
			//if (this.isDown("UP_ARROW")) {
				if (!ENTITIES["Life"].isEmpty()) {
					this.antigravity();
					this.startConsume();
					this.gravityConst(0.05);
					this._jump = 3;
					if (!this.isPlaying("flying")) {
						this.stop().animate("flying", 20, -1);	
					}
					
				} else {
					this.gravity();
				}
				
			//}
		});

		ENTITIES["vampire"].addComponent("Collision")
			.collision(new Crafty.polygon([3, 6],[45, 6],[45, 42],[3, 42]))
			.onHit("BloodPotion", function(e) {
				e[0].obj.destroy(); // TODO remove with style
				ENTITIES["Life"].increaseLife();
			})
			.onHit("Grave", function(e) {
				if (!e[0].obj.isPlaying("burning")) {
					e[0].obj.animate("burning", 60, -1);	
				}
			});

*/

/*		
		ENTITIES["vampire"].addComponent("Gravity").gravity("Ground").gravityConst(0.2);
		ENTITIES["vampire"].addComponent("Vampire, SpriteAnimation")
			.animate("walking", 1, 0, 4)
			.animate("jumping", 3, 0, 5);
		ENTITIES["vampire"].addComponent("Collision").collision(new Crafty.polygon([7, 9],[41, 9],[41, 48],[7, 48]));


		ENTITIES["vampire"].bind("EnterFrame", function() {
			if (this._movement.x !== 0) {
				if (!this.isPlaying("walking")) {
					this.reset().animate("walking", 30, -1);
				}
			} else {
				this.stop().reset();
			}
		});
*/

		// BAT
		ENTITIES["vampire"].addComponent("Gravity").gravity("Ground").gravityConst(0.05);
		ENTITIES["vampire"].addComponent("Collision")
			.collision(new Crafty.polygon([3, 6],[45, 6],[45, 42],[3, 42]))
			.onHit("BloodPotion", function(e) {
				e[0].obj.destroy(); // TODO remove with style
				ENTITIES["Life"].increaseLife();
			})
			.onHit("Grave", function(e) {
				if (!e[0].obj.isPlaying("burning")) {
					e[0].obj.animate("burning", 60, -1);	
				}
			})
		ENTITIES["vampire"].addComponent("Bat, SpriteAnimation").animate("flying", 0, 0, 2).animate("flying", 20, -1);
		ENTITIES["vampire"].addComponent("DelayConsumer").delayConsume(20)
			.bind("Consume", function() {
				ENTITIES["Life"].decreaseLife();
			});
		ENTITIES["vampire"].bind("KeyDown", function() {
			if (this.isDown("UP_ARROW")) {
				if (!ENTITIES["Life"].isEmpty()) {
					this.antigravity();
					this.startConsume();	
				} else {
					this.gravity();
				}
				
			}
		});

		ENTITIES["vampire"].bind("KeyUp", function(e) {
			if(e.key == Crafty.keys['UP_ARROW']) {
				this.gravity();
				this.stopConsume();
			}
		});

		ENTITIES["Life"] = Crafty.e("2D, DOM, Life")
			.attr({x: 10, y: 10, w: WIDTH - 20, h: 5, z: 100})
			.life(0, 20, 1)
			.bind("EnterFrame", function() {
				this.y = this._initialYPos - Crafty.viewport.y; 
				this.x = this._initialXPos - Crafty.viewport.x;
			})
			.bind("LifeMinReached", function() {
				//console.log("LifeMinReached");
			})
			.bind("LifeMaxReached", function() {
				
			});
		// follow the player:
		Crafty.viewport.follow(ENTITIES["vampire"]);

		// Crafty.bind("DecreaseLife", function(e) {
		// 	e._decreaseLifeStart = Crafty.frame();
		// 	if ((Crafty.frame() - this._decreaseLifeStart) % 10) {
		// 		ENTITIES["Life"].decreaseLife();	
		// 	}
		// });
		// Crafty.bind("IncreaseLife", function() {
		// 	ENTITIES["Life"].increaseLife();
		// });
	});
	
	Crafty.scene("Loading");
};