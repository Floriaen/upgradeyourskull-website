/////////////////////////////////////
// Be carefull, this is a dirty code.
// Read it at your own risk
// ©floriaen 2011
//////////////////////////////////

var game = null;
var menuResource = null;
var debug = false;//true;

head.js(
	"scripts/ext/prototype.js", 
	"scripts/ext/Box2dWeb-2.1.a.3.js", 
	"scripts/ext/jColour.js", 
	"scripts/common/Logger.js", 
	"scripts/common/String.js", 
	"scripts/common/Array.js",
	"scripts/service/MapHelper.js", 
	"scripts/service/CanvasHelper.js",

	"scripts/data/PowerElementCount.js", 
	
	"scripts/data/GoAndBackArray.js",
	"scripts/data/ResetArray.js",
	"scripts/data/SimpleArray.js",
	"scripts/data/ScoreBoard.js",
	
	"scripts/data/GameBoard.js",
	
	"scripts/object/UserData.js", 
	"scripts/object/Background.js", 
	"scripts/object/EndBackground.js", 	
	"scripts/object/Timer.js", 
	"scripts/object/Coin.js",
	"scripts/object/Block.js",
	"scripts/object/Bug.js",
	"scripts/object/InvisibleBlock.js",
	"scripts/object/Score.js", 
	"scripts/object/Hero.js", 
	"scripts/object/Camera.js",
	"scripts/object/Sprite.js", 
	"scripts/object/Fire.js", 
	"scripts/object/Bomb.js", 
	"scripts/object/Potion.js",
	"scripts/object/Painter.js",
	"scripts/object/Boss.js",
	"scripts/object/Level.js",
	"scripts/resources/map.js",
	"scripts/service/TextHelper.js",
	
	"scripts/Renderer.js", 
	"scripts/Game.js",
	
	function() {

   		Event.observe(window, 'load', function() {
	
			var b2Vec2 = Box2D.Common.Math.b2Vec2,
		    b2BodyDef = Box2D.Dynamics.b2BodyDef,
		    b2Body = Box2D.Dynamics.b2Body,
		    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
		    b2Fixture = Box2D.Dynamics.b2Fixture,
		    b2World = Box2D.Dynamics.b2World,
		    b2MassData = Box2D.Collision.Shapes.b2MassData,
		    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
		    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
		    b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
		
			menuResource = new Image();
			menuResource.src = 'resources/game/menu.png' + '#' + (new Date()).getTime();

			var fontSprite = new Sprite('resources/game/atarifont.png' + '#' + (new Date()).getTime());
			fontSprite.addTileset('atarifont', 0, 64, 16, 32, 16);

			var blueColors = ['#2262BB', '#2867BE', '#2F6DC2', '#3672C5', '#3D78C9'];
			var greenColors = ['#7FB693', '#89C49F', '#93D2AA', '#9DE0B6', '#A7EEC1'];
			var grayColors = ['#AAAAAA', '#B6B6B6', '#C3C3C3', '#D0D0D0', '#DDDDDD'];

			// loading sprite:
			var t = null;
			var params = extractUrlParams();
			if (params.hasOwnProperty('theme')) {
				t = params['theme'];
				
			} else {
				//t = 'xmas';
			}
			
			var sprite = 'resources/game/thefall.png';
			if (t) {
				sprite = 'resources/game/theme/?t=' + t;
			}
			
			var c = document.getElementById("canvas");
			if (c.imageSmoothingEnabled) {
				c.imageSmoothingEnabled = true;
			} else {
				if (c.mozImageSmoothingEnabled) {
					c.mozImageSmoothingEnabled = true;
				} else if (c.webkitImageSmoothingEnabled) {
					c.webkitImageSmoothingEnabled = true;
				}
			}
			
			game = new Game($("canvas"));
			game.setLevels(
				{1: new Level(1, sprite, 'resources/game/atarifont.png', blueColors)}
			);
			
			if (t && t == 'xmas') {
				game.loadLevel(2); // only on level
			} else {
				game.loadLevel(1); // only on level
			}

			game.loadAndStart();
			
			/*			
			//sprite.addTileset('fire', 0, 42, 16, 16, 5);
			// launch the game:
		    game = new Game($("canvas"));
			game.setLevels(
				{
					1: new Level(1, 'resources/game/thefallSprite.png', 'resources/game/atarifont.png', blueColors),
					2: new Level(2, 'resources/game/thefallSprite_tetris.png', 'resources/game/atarifont.png', blueColors),
					3: new Level(3, 'resources/game/thefallSprite_bw.png', 'resources/game/atarifont.png', grayColors),
					4: new Level(4, 'resources/game/thefallSprite_halloween.png', 'resources/game/atarifont.png', blueColors),
					5: new Level(4, 'resources/game/thefallSprite_adventures.png', 'resources/game/atarifont.png', blueColors)
					
				}
			);
			game.loadLevel(5);
			game.loadAndStart();
			*/
		});
	}
);

function extractUrlParams() {	
	var t = location.search.substring(1).split('&');
	var f = [];
	for (var i = 0; i < t.length; i++){
		var x = t[i].split('=');
		f[x[0]] = x[1];
	}
	return f;

};

if (debug == true) {
	var fpsOut = document.getElementById('fps');
	setInterval(function(){
		if (game) {
			var distance = game.camera.y * 24; //(1200 - game.camera.y);
			fpsOut.innerHTML = 'Version ' + game.version + ' - ' + game.timer.fps.toFixed(1) + "fps - " + ((this.game._world) ? this.game._world.GetBodyCount() : 0) + ' p - ' +  distance.toFixed(1) + ' px';
		}
	}, 1000);	
}