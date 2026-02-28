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
	//"js/components/Flying.js",

	"js/components/Life.js",

	"js/components/DelayConsumer.js",

	"js/components/Block.js",
	"js/components/BloodPotion.js",
	"js/components/MiniHeart.js",
	"js/components/Grave.js",

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

	var debug = false;
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

		darkness: "resources/darkness.png"
		//common: "resources/sprite/common.png",

		//level1: "work/pickleTiles_resize.png"
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
			Crafty.scene("MainScreen"); // MainScreen
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

		Crafty.e("CommonText").attr({x: 0, y: 60, w: WIDTH, h: 100}).write("Press any key to Start");

		Crafty.e("CommonText").attr({x: 0, y: 340, w: WIDTH, h: 100})
			.textSize(20)
			//.write("Burn all the graves</br>becomes the master of the hell");

		var launchGame = function() {
			Crafty.unbind("KeyDown", launchGame);
			Crafty.scene("Game");
		};
		Crafty.bind("KeyDown", launchGame);
	});

	Crafty.scene("Game", function() {
		// Crafty.e("Artery").attr({x: 0, y: 0, w: WIDTH, h: HEIGHT}).createGlobules(20);
		// window.onblur = function() {
		// 			Crafty.pause();
		// 		};
		// 
		// 		window.onfocus = function() {
		// 			Crafty.pause();
		// 		};

		var Map = {
			isGround: function(tileIdx) {
				var t = tileIdx;
				var isGround = _.find([0, 2, 4, 6, 8, 10, 12, 14], function(num){ return num == tileIdx; });
				return (isGround);
			}
		}
		
		Crafty.sprite(48, SPRITES.bat + "#" + SEED, {"Bat": [0, 0]});
		//Crafty.sprite(48, SPRITES.worm + "#" + SEED, {"Worm": [0, 0]});
		//Crafty.sprite(48, SPRITES.vampire + "#" + SEED, {"Vampire": [0, 0]});


/*
		Crafty.sprite(WIDTH, HEIGHT, SPRITES.darkness + "#" + SEED, {"Darkness": [0, 0]});
		var darkness = Crafty.e("2D, DOM, Darkness")
			.attr({x: 0, y: 0})
			.bind("EnterFrame", function() {
				//this.x = ENTITIES["vampire"].x - this.w / 2;
				//this.y = ENTITIES["vampire"].y - this.h / 2;
				this.y = (- Crafty.viewport.y) * 0.6; 
				this.x = (- Crafty.viewport.x) * 0.6;
			})
		*/
			//.unbind("Change");
		//ENTITIES["vampire"].attach(darkness);

		// stars
		for (var i = 0; i < 20; i++) {
			var alpha = Crafty.math.randomInt(1, 5) / 10;
			var x = Crafty.math.randomInt(0, 20 * 48);
			var y = Crafty.math.randomInt(0, 20 * 48);
			(function(x, y, alpha) {
				Crafty.e("2D, DOM, Star, Color")
					.attr({x: x, y: y, w : 2, h: 2, alpha: alpha})
					.color("#FFFFFF")
					.bind("EnterFrame", function() {
						this.y = (y - Crafty.viewport.y) * 0.8; 
						this.x = (x - Crafty.viewport.x) * 0.8;
					});
			})(x, y, alpha);
		}	


		for (var i = 0; i < 20; i++) {
			var alpha = Crafty.math.randomInt(1, 8) / 10;
			var x = Crafty.math.randomInt(0, 20 * 48);
			var y = Crafty.math.randomInt(0, 20 * 48);
			(function(x, y, alpha) {
				Crafty.e("2D, DOM, Star, Color")
					.attr({x: x, y: y, w : 2, h: 2, alpha: alpha})
					.color("#FFFFFF")
					.bind("EnterFrame", function() {
						this.y = (y - Crafty.viewport.y) * 0.6; 
						this.x = (x - Crafty.viewport.x) * 0.6;
					});
			})(x, y, alpha);
		}

		Crafty.e("TiledLevel").tiledLevel(TILEMAP.level1, "DOM");

		// workaround @see https://groups.google.com/forum/?fromgroups#!topic/craftyjs/Z8-1ql1cDOc
		Crafty.map.boundaries = function() {
		 	return {
		 		max: { x: 20 * 48, y: 20 * 48 },
		 		min: { x: 0, y: 0 }
		 	};
		}

		// function create the vampire
		ENTITIES["vampire"] = Crafty.e("2D, DOM, Vampire, Fourway, Plateformer")
			.attr({x: 48, y: 96, w: 48, h: 48})
			.fourway(4)
			.plateform("Block");
			//.multiway(3, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180});

		//ENTITIES["vampire"].addComponent("Plateformer")

		// 48 x 48
		// 34 x 19
		// -------
		// 14 - 18
		// 7 - 9

		ENTITIES["vampire"].addComponent("Keyboard, Oriented").bind("KeyDown", function() {
			// 2023
			if (Crafty.keydown.ArrowRight && Crafty.keydown.ArrowRight === true) {
				this.go("right");
			} else
			if (Crafty.keydown.ArrowLeft && Crafty.keydown.ArrowLeft === true) {
				this.go("left");
			}
			
			/*
			if (this.isDown("RIGHT_ARROW")) {
				this.go("right");
			} else
			if (this.isDown("LEFT_ARROW")) {
				this.go("left");
			}
			*/
		});


		// 41 - 35
		// 6 - 12
		// ------
		// 3 - 6
		

		

		// WORM
/*
		ENTITIES["vampire"].addComponent("Gravity").gravity("Ground").gravityConst(0.2);
		ENTITIES["vampire"].addComponent("SpriteAnimation")
			.animate("walking", 0, 0, 3)
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




		var rect1 = {w: 48, h: 48};
		var rect2 = {w: 20, h: 20};
		function getPoints(rect1, rect2) {
			var x = (rect1.w - rect2.w) / 2;
			var y = (rect1.h - rect2.h) / 2;
			// create the points:
			var points = new Array();
			points.push([x, y]);
			points.push([x + rect2.w, y]);
			points.push([x + rect2.w, y + rect2.h]);
			points.push([x, y + rect2.h]);
			return points;
		}
		//console.log(getPoints(rect1, rect2));


		ENTITIES["vampire"].bind("EnterFrame", function() {
			//Crafty.viewport.x = Crafty.viewport.width/2 - this.x;
			//Crafty.viewport.y = Crafty.viewport.height/2 - this.y;
			//Crafty.viewport.centerOn(this, 100);
		});


		ENTITIES["vampire"].addComponent("Gravity").gravity("Ground").gravityConst(0.05);

		ENTITIES["vampire"].addComponent("Collision")
			//.collision(new Crafty.polygon([3, 6],[45, 6],[45, 42],[3, 42]))
			.collision(new Crafty.polygon(getPoints(rect1, rect2)))
			.onHit("BloodPotion", function(e) {
				e[0].obj.destroy(); // TODO remove with style
				ENTITIES["Life"].increaseLife();
			})
			.onHit("Grave", function(e) {
				if (!e[0].obj.isPlaying("burning")) {
					e[0].obj.animate("burning", 60, -1);	
				}
			});
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
		
		

		Crafty.viewport.follow(ENTITIES["vampire"], 0, 0);

		

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