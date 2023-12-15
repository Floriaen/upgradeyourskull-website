var js = [
	"js/ext/Stats.js",
	"js/ext/underscore.js",
	"js/ext/crafty.js",
	
	// "js/ext/jColour.js",
	// "js/ext/PathFinding.min.js",
	// "js/ext/pixastic.mosaic.js",
	
	"js/components/Jumper.js",
	"js/components/Gain.js",
	"js/components/Revolution.js",	
	"js/components/Satellite.js",
	"js/components/Planet.js",
	"js/components/Lock.js",
	
	"js/entity/Earth.js",
	"js/entity/SatelliteFactory.js",
	"js/entity/RunningMan.js",
	
];

// simple logger wrapper
var Logger = {
	enabled: false,
	log: function() {
		if (Logger.enabled) {
			arguments = (arguments.length == 1)? arguments[0]: arguments;
			console.log(arguments);
		}
	}
};
//Logger.enabled = false;

var scoreText = null;

var WIDTH = 800;
var HEIGHT = 600;
var TILE_SIZE = 64;
var MAX_SPEED = 100;

var DISPLAY_COMPONENTS = "2D, DOM";

var Entities = {};

// LOADER
window.onload = function() {
	head(launchExperiment);
	for (i = 0; i < js.length; i++) {
		head.ready(i, Logger.log(js[i] + " is loading"));
		head.js({i: js[i]});
	}
};
	
function launchExperiment()	{
	
	Crafty.init(WIDTH, HEIGHT);
//	Crafty.canvas.init();
	
	
	if (Logger.enabled === true) {
		var stats = new Stats();
		stats.getDomElement().style.position = 'absolute';
		stats.getDomElement().style.left = '0px';
		stats.getDomElement().style.top = '0px';

		document.body.appendChild(stats.getDomElement());
	
		setInterval( function () {
			stats.update();
		}, 1000 / Crafty.timer.getFPS() );
	}
	
	
	Crafty.scene("Loading", function() {
		Crafty.background("#003153");
		Crafty.e("2D, DOM, Text").attr({x: 0, y: 100, w: WIDTH, h: 100})
			.css({"fontFamily": "SilkscreenNormal", "fontSize": "38px", "text-align": "center", "color": "white"})
			.text("Loading");
		
		// Load images:
		Crafty.load(
			[
				"resources/images/sprite.png", 
				"resources/images/earth.png", 
				"resources/images/ring.png",
				"resources/images/space.png"
			], function() {
			Crafty.scene("StartScreen");
		});
		
		// Sounds
	//	Crafty.audio.add("jump", "resources/sounds/jump.wav");
	//	Crafty.audio.add("blip", "resources/sounds/blip.wav");
		
	});
	
	Crafty.scene("StartScreen", function() {
		Crafty.background("#003153");
		
		var noCache = (new Date()).getTime();
		Crafty.sprite(96, "resources/images/ring.png#" + noCache, {
			"Ring": [0, 0]
		});
		
		Crafty.e("2D, DOM, Text").attr({x: 0, y: 100, w: WIDTH, h: 100})
			.css({"fontFamily": "SilkscreenNormal", "fontSize": "38px", "text-align": "center", "color": "white"})
			.text("LD23 TINY WORLD");
			
		Crafty.e(DISPLAY_COMPONENTS + ", Ring, SpriteAnimation")
			.attr({x: (WIDTH - 96) / 2 , y: 250})
			.animate("loop", 0, 0, 4)
			.animate("loop", 30, -1);
		
		Crafty.e("2D, DOM, Text, Tween").attr({x: 0, y: 175, w: WIDTH, h: 100})
			.css({"fontFamily": "SilkscreenNormal", "fontSize": "20px", "text-align": "center", "color": "white"})
			.tween({alpha: 0.1}, 30)
			.bind("TweenEnd", function(e) {
				if (this.alpha <= 0.1) {
					this.tween({alpha: 1}, 30);
				} else {
					this.tween({alpha: 0.1}, 30);
				}
			})
			.text("Press any key to start");
		
		Crafty.e("2D, DOM, Text").attr({x: 0, y: 400, w: WIDTH, h: 100})
			.css({"fontFamily": "SilkscreenNormal", "fontSize": "18px", "text-align": "center", "color": "white"})
			.text("&lt; Speed &gt;<br />Space to Jump");
		
		Crafty.e("2D, DOM, Text").attr({x: 0, y: 500, w: WIDTH, h: 100})
			.css({"fontFamily": "SilkscreenNormal", "fontSize": "15px", "text-align": "center", "color": "white"})
			.text("- Unfinished and unsubmitted game- </br>Ludum Dare #23 :/<br />&copy; Floriaen");
		
			
		var launchGame = function() {
			Crafty.unbind("KeyDown", launchGame);
			Crafty.scene("Game");
		};
		Crafty.bind("KeyDown", launchGame);
	});
	
	Crafty.scene("GameOver", function() {
		Crafty.background("#000");
		Crafty.e("2D, DOM, Text").attr({x: 0, y: 100, w: WIDTH, h: 100})
			.css({"fontFamily": "SilkscreenNormal", "fontSize": "30px", "text-align": "center", "color": "white"})
			.text("Game Over");
	});
	
	Crafty.scene("Game", function() {

		scoreText = Crafty.e("Lock, DOM, Text")
			.attr({ x: 580, y: 12, h: 20, w: 200, z: 1000})
			.lock("viewport")
			.css({"fontFamily": 'SilkscreenNormal', "fontSize": '60px', "text-align": "right", "color": "white"})
			.text("0");
		
		var score = 0;
		Crafty.bind("PointReached", function(e) {
			score += e;
			scoreText.text(score);
		});

		var noCache = (new Date()).getTime();
		Crafty.sprite(TILE_SIZE, "resources/images/sprite.png#" + noCache, {
			"Man": [0, 1],
			"Fish": [0, 2]
		});
		
		Crafty.sprite(800, "resources/images/earth.png#" + noCache, {
			"Earth": [0, 0]
		});
		
		Crafty.sprite(96, "resources/images/ring.png#" + noCache, {
			"Ring": [0, 0]
		});
		
		Crafty.sprite(800, "resources/images/space.png#" + noCache, {
			"Space": [0, 0]
		});
		
		// init:
		
		// stars
		for (var i = 0; i < 20; i++) {
			var alpha = Crafty.math.randomInt(1, 8) / 10;
			var x = Crafty.math.randomInt(0, WIDTH);
			var y = Crafty.math.randomInt(0, HEIGHT);
			Crafty.e(DISPLAY_COMPONENTS + ", Star, Empty, Color")
				.attr({x: x, y: y, w : 2, h: 2, alpha: alpha})
				.color("#FFFFFF");
		}
		
		earth();
		runningMan();
		
		
		Crafty.viewport.zoom(0.3, WIDTH / 2, HEIGHT / 2, 1);
		setTimeout(function() {
			// breath
			Crafty.viewport.zoom(0, WIDTH / 2, HEIGHT / 2, 60);
		}, 0);
		
		// wait ?
		Entities["ring"] = Crafty.e(DISPLAY_COMPONENTS + ", Ring, Gain, SpriteAnimation")
			.attr({x: (WIDTH - 96) / 2 , y: -500})
			.gain(10)
			.animate("loop", 0, 0, 4)
			.animate("loop", 30, -1);
		
		Crafty.bind("SpeedUp", function(e) {
			Entities["earth"].increaseSpeed();
		});
		
		Crafty.bind("SpeedDown", function(e) {
			Entities["earth"].decreaseSpeed();
		});
	});
	
	Crafty.scene("Loading");
};