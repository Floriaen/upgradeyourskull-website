var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
b2MassData = Box2D.Collision.Shapes.b2MassData,
b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
b2Shape = Box2D.Collision.Shapes.b2Shape,
b2CircleContact = Box2D.Dynamics.Contacts.b2CircleContact,
b2Contact = Box2D.Dynamics.Contacts.b2Contact,
b2ContactConstraint = Box2D.Dynamics.Contacts.b2ContactConstraint,
b2ContactConstraintPoint = Box2D.Dynamics.Contacts.b2ContactConstraintPoint,
b2ContactEdge = Box2D.Dynamics.Contacts.b2ContactEdge,
b2ContactFactory = Box2D.Dynamics.Contacts.b2ContactFactory,
b2ContactRegister = Box2D.Dynamics.Contacts.b2ContactRegister,
b2ContactResult = Box2D.Dynamics.Contacts.b2ContactResult,
b2ContactSolver = Box2D.Dynamics.Contacts.b2ContactSolver,
b2EdgeAndCircleContact = Box2D.Dynamics.Contacts.b2EdgeAndCircleContact,
b2NullContact = Box2D.Dynamics.Contacts.b2NullContact,
b2PolyAndCircleContact = Box2D.Dynamics.Contacts.b2PolyAndCircleContact,
b2PolyAndEdgeContact = Box2D.Dynamics.Contacts.b2PolyAndEdgeContact,
b2PolygonContact = Box2D.Dynamics.Contacts.b2PolygonContact,
b2PositionSolverManifold = Box2D.Dynamics.Contacts.b2PositionSolverManifold,
b2Body = Box2D.Dynamics.b2Body,
b2BodyDef = Box2D.Dynamics.b2BodyDef,
b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
b2ContactListener = Box2D.Dynamics.b2ContactListener,
b2ContactManager = Box2D.Dynamics.b2ContactManager,
b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
b2FilterData = Box2D.Dynamics.b2FilterData,
b2Fixture = Box2D.Dynamics.b2Fixture,
b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
b2Island = Box2D.Dynamics.b2Island,
b2TimeStep = Box2D.Dynamics.b2TimeStep,
b2World = Box2D.Dynamics.b2World,
b2Color = Box2D.Common.b2Color,
b2internal = Box2D.Common.b2internal,
b2Settings = Box2D.Common.b2Settings,
b2Mat22 = Box2D.Common.Math.b2Mat22,
b2Mat33 = Box2D.Common.Math.b2Mat33,
b2Math = Box2D.Common.Math.b2Math,
b2Sweep = Box2D.Common.Math.b2Sweep,
b2Transform = Box2D.Common.Math.b2Transform,
b2Vec2 = Box2D.Common.Math.b2Vec2,
b2Vec3 = Box2D.Common.Math.b2Vec3,
b2AABB = Box2D.Collision.b2AABB,
b2Bound = Box2D.Collision.b2Bound,
b2BoundValues = Box2D.Collision.b2BoundValues,
b2Collision = Box2D.Collision.b2Collision,
b2ContactID = Box2D.Collision.b2ContactID,
b2ContactPoint = Box2D.Collision.b2ContactPoint,
b2Distance = Box2D.Collision.b2Distance,
b2DistanceInput = Box2D.Collision.b2DistanceInput,
b2DistanceOutput = Box2D.Collision.b2DistanceOutput,
b2DistanceProxy = Box2D.Collision.b2DistanceProxy,
b2DynamicTree = Box2D.Collision.b2DynamicTree,
b2DynamicTreeBroadPhase = Box2D.Collision.b2DynamicTreeBroadPhase,
b2DynamicTreeNode = Box2D.Collision.b2DynamicTreeNode,
b2DynamicTreePair = Box2D.Collision.b2DynamicTreePair,
b2Manifold = Box2D.Collision.b2Manifold,
b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint,
b2Point = Box2D.Collision.b2Point,
b2RayCastInput = Box2D.Collision.b2RayCastInput,
b2RayCastOutput = Box2D.Collision.b2RayCastOutput,
b2Segment = Box2D.Collision.b2Segment,
b2SeparationFunction = Box2D.Collision.b2SeparationFunction,
b2Simplex = Box2D.Collision.b2Simplex,
b2SimplexCache = Box2D.Collision.b2SimplexCache,
b2SimplexVertex = Box2D.Collision.b2SimplexVertex,
b2TimeOfImpact = Box2D.Collision.b2TimeOfImpact,
b2TOIInput = Box2D.Collision.b2TOIInput,
b2WorldManifold = Box2D.Collision.b2WorldManifold,
ClipVertex = Box2D.Collision.ClipVertex,
Features = Box2D.Collision.Features,
IBroadPhase = Box2D.Collision.IBroadPhase;

var row = 0;
var ci = 0;
var Renderer = Class.create({
    initialize: function(context, width, height, scaleRatio) {
		this._counter = 0;
	
		this._alphaFadeout = 0;
		this._fadeCounter = 0;
		this._heightGapBound = 100;
        this._tic = 1000 / 60;
        this._drawScale = scaleRatio;
        this._context = context;
		//this._context.scale(2, 2);
		
        this.width = width;
        this.height = height;

		this._background = {
			stars: new Array()
		};
		// create stars
		for (var i = 0; i < 40; i++) {
			this._background.stars.push({x:Math.floor(Math.random() * width), y:Math.floor(Math.random() * height)})
		} 
		this._lightEnable = false;

		//this._backgrounds = null;
		this._masks = [];
		
		this._backgroundGapY = 0;
		
		this._introBackground = new Background(width, height);
		this._endBackground = new EndBackground(width, height);
		
		this._halfCounter = 0;
		this._previousDarkenRatio = 0;
    },

	load: function() {
		this._backgrounds = this._createBackgrounds();
	},

	_getContext: function(name) {
		return this._contexts(name);
	},

	isLightEnable: function() {
		return this._lightEnable;
	},

	setLightEnable: function(flag) {
		this._lightEnable = flag;
	},

    clear: function() {
		this._context.canvas.width = this._context.canvas.width;
        //this._context.clearRect(0, 0, this.width, this.height);
    },

	_createBackgrounds: function() {
		var backgrounds = [];
		
		var backgroundMap = (MapFactory.create(Resources.background[0], _mapsObject));
		var b = backgroundMap.map;
		
		var cvx = this._createBackground(b, 240, 848, 1, 0.8);
		backgrounds.push(cvx);
		//[25, 12, 00]
		this._masks[0] = CanvasHelper.createAlphaMask([0, 0, 10], cvx, 0, 0, cvx.width, cvx.height);
	
		//this._drawNightVeil2(this._masks[0]);
	
	/*
		[25, 12, 00], //190C00
		//[0, 0, 0],
		this._tileset.image, 
		this._graphics.tileX, 
		this._graphics.tileY, 
		this._tileset.w, 
		this._tileset.h
		
		
		this._masks[0] = this._createBackground(b, 240, 848, 1, 0.6);
		this._drawNightVeil2(this._masks[0]);
	*/	
		
		// var backgroundMap = (MapFactory.create(Resources.background[0], _mapsObject));
		// 	backgrounds.push(this._createBackground(backgroundMap.map, 464, 848, 10, 0.2));
		// 	
		// 	
		// 	var cvx = this._createBackground(b, 464, 848, 10, 0.6);
		// 	backgrounds.push(cvx);
		// 	
		// 	
		// 	// TODO clone
		// 	this._masks[1] = this._createBackground(b, 464, 848, 10, 0.6);
		// 	this._drawNightVeil2(this._masks[1]);
		
		
		return backgrounds;
	},
	
	_createBackground: function(map, width, height, scale, alpha) {
		var background = document.createElement('canvas');
		background.width = width;
		background.height = height;
		var context = background.getContext('2d');

		var i, j, l = map.length;
		var diff = scale;

		for (i = 0; i < l; i++) {
			var line = map[i];
			for (j = 0; j < line.length; j++) {
				var p = line[j];
				var tileName = mapGenerator.getTilesetName(p);
				if (tileName) {
					var tile = game.sprite.getTileset(tileName);
					var sw = (0.5 + (tile.w - diff)) << 0;
					var sh = (0.5 + (tile.h - diff)) << 0;
					
					context.save();
					context.translate(j * (tile.w - diff) + 8, i * (tile.w - diff));
					var fillStyle = null;
					if (alpha > 0.3) {
						fillStyle = [47, 109, 193];
						//context.fillStyle = "rgb(0, 7, 25)";					
					} else {
						fillStyle = [29, 83, 164];
						//context.fillStyle = "rgb(0, 7, 25)";					
					}
					
					var mask = CanvasHelper.createAlphaMask(fillStyle, tile.image, 0, 0, tile.image.width, tile.image.height);
					context.drawImage(
						mask, tile.x, tile.y, 
						tile.w, 
						tile.h, 
						0, 
						0,
						sw, 
						sh					
					);
					/*
					context.fillRect(
						0, 0, sw, sh
					);
					*/
					//if (alpha > 0.3) {
						context.globalAlpha = alpha;
						context.drawImage(
							tile.image, tile.x, tile.y, 
							tile.w, 
							tile.h, 
							0, 
							0,
							sw, 
							sh						
						);
				//	}

					context.restore();
				}
			}			
		}
		return background;
	},

	_drawBackground: function() {
		
		var s = this._context;
		
		if (game._isRunning == true) {
			s.save();
			 

			// gradient:
			// http://www.herethere.net/~samson/php/color_gradient/?cbegin=2262BB&cend=3D78C9&steps=4
			var stripeHeight = this.height/5;
		
			var colors = game.getCurrentLevel().getBackgroundColors();
			var i = 0;
		
			/*
			var newDarkenRatio = (game.timer.getTime() / (game.score.getMaxLevelTime() / 10)) * 100;
			var ratio = newDarkenRatio - this._previousDarkenRatio;
			this._previousDarkenRatio = newDarkenRatio;
			*/
		
			for (i = 0; i < colors.length; i++) {
				if (this._counter == 0 && colors[i].lightness > 10) {
					// TODO must be dependent of timer!
				 	colors[i].darken(0.15);
				}
				s.fillStyle = colors[i].rgb();
				s.fillRect(0, stripeHeight * i, this.width, stripeHeight);
			}

			var alphaForStars = Math.random() * 1;
			for (var i = 0; i < this._background.stars.size(); i++) {
				//game.timer.getTime() / (game.score.getMaxLevelTime() / 2);
			
				alphaForStars = Math.random() * (game.timer.getTime() / 60);
			
				//alphaForStars = Math.random() * 1;
				alphaForStars = alphaForStars.toFixed(2);
				//alphaForStars = Math.floor(Math.random() * game.mapHelper.getMapOffset())/10;
				s.fillStyle = "rgba(255, 255, 255, " + alphaForStars + ")";
				s.fillRect(this._background.stars[i].x,	this._background.stars[i].y, 1, 1);
			}

			s.restore();
			if (this._backgrounds == null) {
				this._backgrounds = this._createBackgrounds();
			}
		
		
			// var b = this._backgrounds[1];
			// 	s.save();
			// 	//s.scale(0.5, 0.5);
			// 	s.translate(0, -game.camera.y * this._drawScale * 0.08);
			// 	game.painter.drawImage(
			// 		b, 0, 0, b.width, b.height, 
			// 		0, 0, this.width, this.height
			// 	);
			// 	/*
			// 	s.globalAlpha = game.camera.y / 600;
			// 	game.painter.drawImage(
			// 		this._masks[1], 0, 0, b.width, b.height, 
			// 		0, 0, this.width, this.height
			// 	);
			// 	*/
			// 	s.restore();	
			// 	

			b = this._backgrounds[0];
			s.save();
			var y = game.camera.y * this._drawScale * 0.3;		
			var x = 0; //game.camera.x * this._drawScale * 0.01;
			if (y > b.height + this._backgroundGapY) { 
				this._backgroundGapY += b.height + this.height;
			}

			// 3 a simple decay
			var tx = (0.5 + (-x + 6.5)) << 0;
			var ty = (0.5 + (-y + this._backgroundGapY)) << 0;
		
			s.translate(tx, ty);
			game.painter.drawImage('main',
				b, 0, 0, b.width, b.height, 
				0, 0, this.width, this.height
			);
		
			var globalAlpha = game.timer.getTime() / (game.score.getMaxLevelTime() / 1.2);
			if (globalAlpha > 0.8) {
				globalAlpha = 0.8;
			}
			s.globalAlpha = globalAlpha;
			game.painter.drawImage('main',
				this._masks[0], 0, 0, b.width, b.height, 
				0, 0, this.width, this.height
			);
			s.restore();
		}
		// intro background:
		this._introBackground.update(this._context, game.camera);
		this._introBackground.draw();
		/*
		this._endBackground.update(this._context, game.camera, game.mapHelper.getMaxMapHeight() * 16);
		this._endBackground.draw();	
		*/
	},
	
	/*
	_drawNightVeil2: function(context) {
		var c = context.getContext('2d');
		c.save();	
		c.globalCompositeOperation = 'source-atop';

		var alpha = game.timer.getTime() / (game.score.getMaxLevelTime() / 2);
		c.fillStyle = '#191970';
		c.fillRect(0, 0, context.width, context.height);
		c.restore();
	},
	*/
	
	/*
	_drawNightVeil: function() {
		
		this._context.save();
		
		//this._context.globalCompositeOperation = 'source-atop';
		
		var alpha = game.timer.getTime() / (game.score.getMaxLevelTime() / 2);
		if (alpha > 1) {
			alpha = 1;
		}
		this._context.fillStyle = "rgba(0, 0, 51, " + alpha + ")";
		this._context.fillRect(0, 0, this.width, this.height);
		this._context.restore();
	},
	*/
	
	
	_drawScore: function() {
		game.score.update(null, this._context);
		game.score.draw();
	},
	
	fadeIntro: function() {
		// 
	},

    drawWorld: function(world) {
	
		this._counter = (this._counter + 1) % 10;
		this._fadeCounter = (this._counter + 1) % 2;
		this._halfCounter = (this._halfCounter + 1) % 30;
        this.clear();

		if (world) {
			this._drawBackground();
		
	        var b;
	        var f;
	        var s;
	        var j;

			var offset = 0;
	        //var color = new Box2D.Common.b2Color(0, 1, 0);
			var color = "0x0033dd";
			

	        for (b = world.m_bodyList; b; b = b.m_next) {
				var drawIt = true;
			
				var x = b.GetPosition().x * this._drawScale;
				var y = b.GetPosition().y * this._drawScale;

				var data = b.GetUserData();
				if (data) {
					if (data.name !== 'hero') {
						var tile = data.getTileset();
						data.update(b, this._context);
					// update
					
						if (x - tile.w > this.width || (x + tile.w) < 0) {
							drawIt = false;
							data.kill();
						} else
						if (y - (tile.h + this._heightGapBound) > this.height) {
							drawIt = false;	
							if (b.GetType() == b2Body.b2_dynamicBody) {// && name == 'step') {
								data.kill();
							}
						} else 
						if ((y + tile.h) < 0) {
							drawIt = false;	
							data.kill();
						}
					

						// destroy if needed
						if (data.isDead()) {
							world.DestroyBody(b); // and do not draw
						} else {
							if (drawIt) {
								data.draw();
							}
						}
					}
				} else {
					world.DestroyBody(b);	
				}
	        }
	
			// draw the hero
			var userData = game._userB2Body.GetUserData();
			if (userData.isDead()) {
				world.DestroyBody(game._userB2Body);
			} else {
				userData.update(game._userB2Body, this._context);	
				userData.draw();
			}

			if (game.isRunning()) {
				this._drawScore();
			}
		}
		
	
		// fade
		if (this._fadeCounter === 0) {	
			if (game._endLevel === true) {
				if (this._alphaFadeout <= 1) {
					this._alphaFadeout += 0.2;
				} else {
					this._alphaFadeout = 1;
					//game.textHelper.drawText(this._context, 10, 10, 'Great! You fell ' + game.camera.y +' meter');
				}
			} 
		}
		game.painter.fade('main', this._alphaFadeout);
		
		
		if (game.displayHighScore == true) {
			game.restartAllowed = true;
			game.textHelper.drawText(this._context, 'auto', 12, 'Best scores ever!', 0.50);
			game.textHelper.drawText(this._context, 'auto', 32, '----------------', 0.50);
			
			//debugger;
			var board = game.score.gameBoard.getScoreBoard();
			this._context.save();

			var w = (0.5 + (board.width * 0.45)) << 0,
				h = (0.5 + (board.height * 0.45)) << 0;
			this._context.drawImage(
				board, 0, 0, 
				board.width, board.height, 29, 60, w, h
			);
			this._context.restore();
			
			if (this._halfCounter > 15) {
				game.textHelper.drawText(this._context, 'auto', 170, 'Hit enter, replay', 0.43);
			}
		} else {
			
			if (this._alphaFadeout >= 1) {
				var dist = game.score.getFellDistance();
				var congrat = 'Great!';
				if (dist < 50) {
					congrat = 'WTF!';
				} else
				if (dist > 1000) {
					congrat = 'OMG!';
				} else 
				if (dist > 2000) {
					congrat = '%^YH!';
				}
				
				
				game.textHelper.drawText(this._context, 'auto', 12, congrat, 0.50);
				game.textHelper.drawText(this._context, 'auto', 32, 'You fell ' + game.score.getFellDistance() +' meters', 0.43);
				
				var r = 0.34;
				game.textHelper.drawText(this._context, 'auto', 70, 'Save your score by typing your name' + ' ', r);
				//game.textHelper.drawText(this._context, 'auto', 90, 'Type your name.' + ' ', r);
				game.textHelper.drawText(this._context, 'auto', 90, 'Hit enter to validate or escape.' + ' ', r);
				
				var l = 9 - game.score.getName().length;
				var ta = new Array(l);
				var tt = ta.join('.');
				
				game.textHelper.drawText(this._context, 'auto', 120, game.score.getName() + ' ', 0.43);
				if (this._halfCounter > 15) {
					if (game.score.getName().length < 8) {
						game.textHelper.drawText(this._context, 'auto', 120, game.score.getName() + '_', 0.43);
					}
					
				}
			}

		}
    }

});