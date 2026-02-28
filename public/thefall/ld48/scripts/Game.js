//var this._offsetHeight = 270/24;
var offset = 0;

var Game = Class.create({
    initialize: function(board) {
		this.version = 0.23;
		this._board = board;
		this._run = true;
		this._firstLaunch = true;
		this._scaleRatio = 24;
		this._newGame = true;
		
		this._levels = null;
		
		this.painter = new Painter(board);
		this.painter.setDebugMode(false);

		this.textHelper = null;
		this._currentLevel = 1;
			
		
//		this._resetAndInit();
    },

	debug: {
		setDestructorMode: function() {
			var i = 0;
			while (i++ < 5) {
				game.score.fireCount.addElement();	
			}
		}
		
	},

	_resetAndInit: function() {
	//	console.log('resetAndInit');
		
		this._world = null;
		this._waitingToStart = true;

		// TODO
		this._control = {
			isRight: false,
			isLeft: false,
			isUp: false,
			isDown: false,
			jump: false,
			jumpRelease: true,
			canJump: false,
			jumping: false,
			falling: false,
			eat: false
		};

		this._offsetHeight = 0; //270/24;

		this._counter = 0;
		this._lastMapOffsetWhereCoinHasSeen = 0;
		this._endLevel = false;
		this._disableUserControl = false;

		this.camera = new Camera(0, 0, this._board.width, this._board.height);
		//console.log(this._board.width, this._board.height);
		this.renderer = new Renderer(this._board.getContext('2d'), this._board.width, this._board.height, this._scaleRatio);
		//this.renderer.setLightEnable(true);
		
		//this._isLightEnable = true;		

		// 1 - Generate level maps:
		var maps = new Array();
		var m = null;
		for (var i = 0; i < 100; i++) {
			//m = mapGenerator.generate(60);
			m = mapGenerator.getRandomMap();
			maps.push(MapFactory.create(m, _mapsObject));	
		}
		// 2 - Create the helper
		this.mapHelper = new MapHelper(maps, 4000);
		var m1 = mapGenerator.getFirstMap(),
			m2 = mapGenerator.getLastMap();

		this.mapHelper.setBoundMaps(
			MapFactory.create(m1, _mapsObject),
			MapFactory.create(m2, _mapsObject)
		);

		this.sprite = null;

		this.score = new Score(100, this._board.width);
		this.timer = new Timer(60);

		this.displayHighScore = false;

		this._isRunning = false;
		this._wallFlip = false;
		//this._objectList = [];

//		this._resetAndInit();

		

		// a reference to the hero
		this._userB2Body = null;
		this.restartAllowed = false;
		
		this.forceTime = 0;
	},
	
	reset: function() {
		this._currentLevel = 1;
		this.stop();
		this.loadLevel(this._currentLevel);
		this.loadAndStart();
	},
	
	restart: function() {
		this.stop();
		this.loadLevel(this._currentLevel);
		this.loadAndStart();
	},
	
	nextLevel: function() {
		if (this._currentLevel == 4) {
			// stop
		} else {
			this._currentLevel += 1;
			this.stop();
			this.loadLevel(this._currentLevel);
			this.loadAndStart();
		}
	},
	
	setLevels: function(levels) {
		this._levels = levels;
	},
	
	getCurrentLevel: function() {
		return this._levels[this._currentLevel];
	},

	loadLevel: function(level) {
		if (level == 1) {
			this._isLightEnable = true;
		} else
		if (level == 2) {
			this._wallFlip = true;
			this._isLightEnable = false;
			//this._isLightEnable = true;
		} else {
			this._isLightEnable = true;
		//	this._isLightEnable = false;
			this._wallFlip = false;
		}
		
		this._currentLevel = 1;//level;
	//	if (!this._firstLaunch) {
			this._resetAndInit();
	//	}
		
		// get back the level object
		var l = this.getCurrentLevel();
		this.addFontSprite(l.getFontSprite());
		this.addGameSprite(l.getGameSprite());
		
		l.load(function() {
			//debugger();
			
		});
	},

	isLightEnable: function() {
		return this._isLightEnable;
	},
	
	addFontSprite: function(sprite) {
		this.fontSprite = sprite;
	},

	addGameSprite: function(sprite) {
		this.sprite = sprite;
	},

	loadAndStart: function() {
		var s = this;
		this.sprite.load(function() {
			// load font:
			s.loadFont(function() {
				s._waitingToStart = false;
				s.camera.slide(true);
				s.getWorld();
				if (s._newGame === true) {
					s._newGame = false;
					s._setListener();
					s.renderer.load();
					setTimeout(function() {
						$('canvas').setStyle({zIndex: 2});
					}, 500);
				}
				s.start();	
			});
		});
	},
	
	loadFont: function(callback) {
		var s = this;
		this.fontSprite.load(function() {
			s.textHelper = new TextHelper(s.fontSprite.getTileset('atarifont'));
			//s.textHelper.cache(['FALL TO START', 'FIRE COLLECTED:', 'COIN COLLECTED:', 'BOMB IMPACT:', 'TIME REMAINING:']);
			s.textHelper.cache(['FALL TO START']);
			callback();                          
		});                                      
	},                                           
                                                 
	_createWorld: function() {
		this._world = new b2World(
	        new b2Vec2(0, 900/this._scaleRatio)
	        //gravity
	        , true
	        //allow sleep
        );
		this._createPopulation();
		this._setContactListener();
		
	
		
		// TODO create decorum
	    // 1 - ground
	    // 2 - wall
	    // 3 - actor

		return this._world;
	},
	
	_setListener: function() {
		var s = this;
		Event.observe(window, 'keydown', function(e) {
			var code;
			if (!e) e = window.event;
			if (e.keyCode) code = e.keyCode;
			else if (e.which) code = e.which;

			var character = String.fromCharCode(code);
			if (s._endLevel) {
				var typedName = s.score.getName();
				// DELETE
				if (code === 8) {//Event.KEY_DELETE) {
					Event.stop(e);
					if (typedName && typedName.length > 0) {
						typedName = typedName.substr(0, typedName.length - 1);
						s.score.setName(typedName);
					}
				} else
				// VALIDATE
				if (code === Event.KEY_RETURN) {
					Event.stop(e);
					if (s.restartAllowed === true) {
						s.restartAllowed = false;
						s.reset(); // restart
					} else {
						// validate the name and set the score:
						s.score.gameBoard.save(s.score.getName(), s.score.getFellDistance());
						s.displayHighScore = true;
					}
				} else {
					/*
						// RESTART
						if (code === 32 && s.restartAllowed === true) {

						} else
					*/
					
					if (typedName.length < 8) { // no more character
						if ((code >= 48 && code <= 57) || (code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
							typedName += character;
							s.score.setName(typedName);
							Event.stop(e);
						}
					}
				}
				
			} else {
				if (code == Event.KEY_RIGHT) {
					s._control.isRight = true;
					Event.stop(e);
				} else
				if (code == Event.KEY_LEFT) {
					s._control.isLeft = true;
					Event.stop(e);
				}

				if (code == Event.KEY_UP) {
					s._control.isUp = true;
					Event.stop(e);
				} else
				if (code == Event.KEY_DOWN) {
					s._control.isDown = true;
					Event.stop(e);
				} else
				if (code == 65) {
					//s.consoleBlocks();
				}

				if (code == 32 ) { // space
				
					
					if (s._control.jumpRelease) {
						s._control.jumpRelease = false;
						s._control.jump = true;
					}

					Event.stop(e); // prevent that space key scrolls the page
				} else 
				if (code == 88) { // x
					if (debug) {
						// take snapshot:
						var ctx = s._board.getContext('2d');
						var data = ctx.getImageData(0, 0, s._board.width, s._board.height);
						var canvas = document.createElement('canvas');
						canvas.width = s._board.width;
						canvas.height = s._board.height;
						canvas.getContext('2d').putImageData(data, 0, 0);
						document.body.appendChild(canvas);
						canvas.style.width = '480px'; 
						canvas.style.height = '575px';
					}
					
					
					//s._control.eat = true;
					if (s.forceTime > 0) {
						if ((s.timer.getTime() - s.forceTime) > 2) {
							s.forceTime = 0;
							s.bomb(s._userB2Body, 4, 100);
						} else {

						}
					} else {
						// start
						s.forceTime = s.timer.getTime();
					}
				}
			}
		});

		Event.observe(window, 'keyup', function(e) { 
				var code;
			if (!e) e = window.event;
			if (e.keyCode) code = e.keyCode;
			else if (e.which) code = e.which;
		//			console.log(Event.KEY_SPACE);
			var character = String.fromCharCode(code);
			if (this._endLevel) {
				
				
			} else {
				if (code == Event.KEY_RIGHT) {
					s._control.isRight = false;
					Event.stop(e);
				} else
				if (code == Event.KEY_LEFT) {
					s._control.isLeft = false;
					Event.stop(e);
				}

				if (code == Event.KEY_UP) {
					s._control.isUp = false;
					Event.stop(e);
				} else
				if (code == Event.KEY_DOWN) {
					s._control.isDown = false;
					Event.stop(e);
				}

				if (code == 32) { // space
					s.forceTime = 0;
					s._control.jump = false;
					s._control.jumpRelease = true;
					Event.stop(e);
				} else
				if (code == 88) { // x
					//s._control.eat = false;
					s.forceTime = 0; // reset
				}
			}
		});
	},
	
	consoleBlocks: function() {
		for (b = this._world.m_bodyList; b; b = b.m_next) {
			console.log('x:', (b.GetPosition().x * 24).toFixed(1), 'y:', (b.GetPosition().y * 24).toFixed(1), b.GetType(), b.GetUserData(), b);
		}
	},
	
	_setContactListener: function() {
		var s = this;
		this._world.SetContactListener({
			BeginContact : function(point) {
				var userBody = s._userB2Body;
				var userData = userBody.GetUserData();
				
				var bodyA = s._getNameFromb2Body(point.m_nodeA.other);
				var bodyB = s._getNameFromb2Body(point.m_nodeB.other);
				
				var nameA = s._getNameFromb2Body(point.m_fixtureA);
				var nameB = s._getNameFromb2Body(point.m_fixtureB);
			
				var bA = point.m_nodeA.other;
				var bB = point.m_nodeB.other;
				
				if (nameA == 'groundsensor' || nameB == 'groundsensor') {
					s._control.falling = false;
					s._control.jumping = false;
					s._control.canJump = true;
					
					userData._init = true;

					s._heroCollisionHandler(bA, bB, 'fixedStep');				
					s._heroCollisionHandler(bA, bB, 'fire');
					
					s._heroCollisionHandler(bA, bB, 'curse');
					s._heroCollisionHandler(bA, bB, 'cure');
					s._heroCollisionHandler(bA, bB, 'coin');
				}
				s._heroCollisionHandler(bA, bB, 'bomb');
				
					
				if (bodyA == 'hero') {
					if (s._inceptionMode == true) {
						//typeof userData.infect == 'function'
						if (point.m_nodeB.other.GetUserData()['infect'] != undefined) {
							point.m_nodeB.other.GetUserData().infect()
						}
						//point.m_nodeB.other.SetType(b2Body.b2_dynamicBody); // wall destroy => 
					}
				}
			
				if (bodyB == 'hero') {
					if (s._inceptionMode == true) {
						if (point.m_nodeA.other.GetUserData()['infect'] != undefined) {
							point.m_nodeA.other.GetUserData().infect()
						}
						//point.m_nodeA.other.SetType(b2Body.b2_dynamicBody); // wall destroy => 
					}
				}

				if (bodyA == 'step') { // || bodyA == 'fixedStep') {
					point.m_nodeA.other.SetType(b2Body.b2_dynamicBody);
					if (bodyB == 'hero') {
						if (s._inceptionMode == true) {
							//point.m_nodeA.other.SetType(b2Body.b2_dynamicBody); // wall destroy => 
							if (point.m_nodeA.other.GetUserData()['infect'] != undefined) {
								point.m_nodeA.other.GetUserData().infect()
							}
						}

						if ((point.m_fixtureA.GetBody().GetPosition().y - point.m_fixtureB.GetBody().GetPosition().y) > 0) {
							// hero
						//	s.score.addHurtPoint();
						}
					}
				}
			
				if (bodyB == 'step' ) { //|| bodyB == 'fixedStep') {
					point.m_nodeB.other.SetType(b2Body.b2_dynamicBody);
				
					if (s._inceptionMode == true) {
						//point.m_nodeA.other.SetType(b2Body.b2_dynamicBody); // wall destroy => 
						if (point.m_nodeA.other.GetUserData()['infect'] != undefined) {
							point.m_nodeA.other.GetUserData().infect()
						}
					}
				
					if (bodyA == 'hero') {
						if((point.m_nodeB.other.GetPosition().y - point.m_nodeA.other.GetPosition().y) > 1.0) {
//							console.log('hurt');
						}
					}	
				}
			},
			PreSolve : function(point) {
				// console.log(point);
			},
			PostSolve : function(point) {
				// console.log(point);
			},
			EndContact : function(point) {
			//	debugger;
				/*
				var nameA = s._getNameFromb2Body(point.m_fixtureA);
				var nameB = s._getNameFromb2Body(point.m_fixtureB);

				if (nameA == 'groundsensor') || 
					nameB == 'groundsensor') {
					
				
					//var r = 1;
					
					// if x is the same

					//s._controll.falling = false;
				}
				*/
			}
		});
	},
	
	_heroCollisionHandler: function(bodyA, bodyB, collideObjectName) {
		//console.log('bomb');
		
		
		var hero = other = null;
		var nameBodyA = this._getNameFromb2Body(bodyA);
		var nameBodyB = this._getNameFromb2Body(bodyB);
		
		var otherBody = null, heroBody = null;
		
		if (nameBodyA == 'hero' && nameBodyB == collideObjectName) {
			hero = bodyA.GetUserData();
			other = bodyB.GetUserData();
			otherBody = bodyB;
			heroBody = bodyA;
		} else
		if (nameBodyA == collideObjectName && nameBodyB == 'hero') {				
			hero = bodyB.GetUserData();
			other = bodyA.GetUserData();
			otherBody = bodyA;			
			heroBody = bodyB;
		}
	
		if (hero && other && !hero.isDead() && !other.isDead()) {
			switch (other.name) {
				case 'dirt':
				case 'grass':
					if (hero.getMode() == 'cursed') {
						
						// TODO:
						//other.infect();
						this.infect(heroBody, 1);
					}
					
				break;
				
				case 'bomb':
					//if (hero.getMode() != 'cursed') {
					other.killedBy(hero);
					if (hero.getMode() != 'destructor') {
						this.score.addBomb();
						this.bomb(otherBody, 3, 40);
					} else {
						debugger
					}
						
						
						//this.score.bombCount.addElement();

				//	}					
				break;
				case 'fire':
					other.killedBy(hero);
					if (hero.getMode() != 'cursed' && hero.getMode() != 'destructor') {
						this.score.fireCount.addElement(); 
					}
				break;
				case 'cure':
					other.killedBy(hero);
					if (hero.getMode() != 'destructor') {
						this.score.addCure();
						hero.setCursed(false);
					}					
				break;
				case 'curse':
					other.killedBy(hero);
					if (hero.getMode() != 'destructor') {
						this.score.addCurse();
						hero.setCursed(true);
						this.infect(heroBody, 1);
					}
				break;
				case 
				'coin':
					other.killedBy(hero);
					// you win
					if (hero.getMode() != 'destructor') {
						this.score.addCoin();
					}
					
				break;
			}
		}
	},
	
	_getNameFromb2Body: function(body) {
		var data = body.GetUserData();
		var name = null;
		if (data && data.hasOwnProperty('name')) {
			name = data.name;
			switch (name) {
				case 'dirtFixed':
					name = 'step';
				break;
				case 'dirt':
					name = 'fixedStep';
				break;
				case 'grass':
					name = 'fixedStep';
				break;
				case 'block':
					name = 'fixedStep';
				break;
				case 'fallingGrass':
					name = 'step';
				break;
			}
		}
		return name;
	},
	
	_createPopulation: function() {
		// 11
		this._createNextDecorum();
		//this._createUser();
	},
	
	_createUser: function(x, y) {
		var fixDef = new b2FixtureDef;
	   
		fixDef.density = 2;
	    fixDef.friction = 0.1;
	    fixDef.restitution = 0.3;

		var bodyDef = new b2BodyDef;
		bodyDef.allowSleep = true;
		// hero
		bodyDef.type = b2Body.b2_dynamicBody;
		/*
		var massData = new b2MassData();
		massData.center = new b2Vec2(0.0, 0.0);
		massData.I = 0;
		massData.mass = 100;		
		*/
		bodyDef.userData = new Hero();
		
		bodyDef.position.x = x; //(this.renderer.width / 2) / this._scaleRatio;
	    bodyDef.position.y = y;
		
		//bodyDef.massData.mass = 2.0;
	
		fixDef.shape = new b2PolygonShape;
		fixDef.density = 2;
		fixDef.friction = 0.1;//0.3;
	    fixDef.restitution = 0.3;//0.2;
	    fixDef.shape.SetAsBox((10 / this._scaleRatio) / 2, (10 / this._scaleRatio) / 2);
	
		var us = this._world.CreateBody(bodyDef);
		us.CreateFixture(fixDef);
		
		var groundSensor = new b2FixtureDef();
		groundSensor.shape = new b2PolygonShape;
		groundSensor.shape.SetAsBox((10 / this._scaleRatio) / 2, (10 / this._scaleRatio) / 2);
		groundSensor.isSensor = true;
		groundSensor.userData = {
			name: "groundsensor"
		};
	//	groundSensor.SetAsOrientedBox(10/30,5/30,new b2Vec2(0,27/30), 0);
		us.CreateFixture(groundSensor);
		us.GetUserData().setBody(us);
		us.GetUserData().setMode('normal');
		
		this._userB2Body = us;
	},
	
	getWorld: function() {
		if (this._world == null) {
			this._world = this._createWorld();
		}
		return this._world;
	},
	
	_createNextDecorum: function() {
		
		var objectList = [];

		var tileSize = 16;
		var map = this.mapHelper.getNextMap();
		
		// experimental 
		// create a map of lightness, that's pretty cool
		
		// only one coin in each bunck of map:
		var isCoinAlreadyCreated = false;
		
		var lightnessMap = null;
		if (this.isLightEnable()) {
			lightnessMap = this.mapHelper.createLightnessMap(map, [6, 10]);
		}

		var bodyDef = new b2BodyDef;
		bodyDef.type = b2Body.b2_staticBody;
	
		var fixDef = new b2FixtureDef;
	    fixDef.density = 10.0;
	    fixDef.friction = 0.1;
	    fixDef.restitution = 0.1;
		fixDef.shape = new b2PolygonShape;

		var tile = this.sprite.getTileset('dirt');
		
		var objectX = 0, objectY = 0, objectWidth = 16, objectHeight = 16;
		var rw = tileSize / this._scaleRatio;
		var rh = tileSize / this._scaleRatio;
		var flipV = true;
		var flipH = false;
		for(var i = 0; i < map.length; i++) {
			flipV = !flipV;
			for(var j = 0; j < map[i].length; j++) {
				flipH = !flipH;
				bodyDef.type = b2Body.b2_staticBody;

				var m = map[i][j];
				objectX = j * rw + rw / 2;
				objectY = (i * rh + rh / 2) + this._offsetHeight;
				objectWidth = 16;
				objectHeight = 16;
				
				var alpha = 0;
				if (this.isLightEnable()) {
					var light = lightnessMap[i][j];
					alpha = (lightnessMap[i][j] == null) ? 0.4 : light/10 + 0.05 * light;
					//alpha = alpha * 1.3;
				}
				
				var blockHFlip = ((Math.random() * 2) > 1) ? false : true;
				
				switch (m) {
					case 0:
						bodyDef.userData = this._getUserDecorumTileData('step', 'dirtFixed', alpha, false, blockHFlip);
					break;
					case 1:
						bodyDef.userData = this._getUserDecorumTileData('fixedStep', 'dirt', alpha, false, blockHFlip);
					break;
					case 2:
						bodyDef.userData = this._getUserDecorumTileData('fixedStep', 'grass', alpha, false, blockHFlip);
					break;
					case 3:
						// wall
						bodyDef.userData = this._getUserDecorumTileData('fixedStep', 'block', alpha, flipV, flipH);
						//bodyDef.userData.setLight(0);
					break;
					case 4:
						bodyDef.userData = this._getUserDecorumTileData('step', 'fallingGrass', alpha, false, blockHFlip);
					break;
					case 6:
						objectY = objectY + 5/this._scaleRatio;

						objectWidth = 6;
						objectHeight = 6;

						bodyDef.userData = new Fire();
						fixDef.isSensor = true;
					break;
					case 7:
						// 30, 30
						objectY = objectY + 4/this._scaleRatio; // 5

						objectWidth = 8;
						objectHeight = 8;

						bodyDef.userData = new Bomb();
						fixDef.isSensor = true;
					//	fixDef.isSensor = true;
						
						
						//m = null;
					break;
					case 8:
						objectY = objectY + 4/this._scaleRatio;

						objectWidth = 8;
						objectHeight = 8;

						bodyDef.userData = new Potion('cure');						
						fixDef.isSensor = true;
					break;
					case 9:
						objectY = objectY + 4/this._scaleRatio;

						objectWidth = 8;
						objectHeight = 8;

						bodyDef.userData = new Potion('curse');
						fixDef.isSensor = true;
					break;	
					case 10:							
					/*	
						objectX = ((96)) / this._scaleRatio;
						
						objectWidth = 160;
						objectHeight = 159;
						
						bodyDef.userData = new Boss();
						//fixDef.isSensor = true;
					*/
						/*
						var createCoin = false;						
						// first condition:
						if (isCoinAlreadyCreated == false && this.camera.y >= 100) {
							if (this._lastMapOffsetWhereCoinHasSeen == null) {
								this._lastMapOffsetWhereCoinHasSeen = this.mapHelper.getMapOffset();
								createCoin = true;
							} else {
								if ((this.mapHelper.getMapOffset() - this._lastMapOffsetWhereCoinHasSeen) % 3 == 0) {
									this._lastMapOffsetWhereCoinHasSeen = this.mapHelper.getMapOffset() + 1;
									createCoin = true;
								}
							}
						}
						*/
						var createCoin = true;
						if (createCoin) {
							//console.log('create coin', this.mapHelper.getMapOffset());
							bodyDef.userData = new Coin();
							fixDef.isSensor = true;
						} else {
							m = null;
						}
					break;	
					case 11:
						m = null;
						this._createUser(objectX, objectY);
					break;	
					case 12:
						bodyDef.userData = new InvisibleBlock();
					break;
					case 13:
						m = null;
						objectWidth = 16;
						objectHeight = 16;
						
						//bodyDef.allowSleep = true;
//						bodyDef.fixedRotation = true;
						bodyDef.position.x = objectX;
					   	bodyDef.position.y = objectY;

						fixDef.shape.SetAsBox((objectWidth / this._scaleRatio) / 2, (objectHeight / this._scaleRatio) / 2);
						var box2dBody = this._world.CreateBody(bodyDef);
						fixDef.isSensor = false;
						box2dBody.CreateFixture(fixDef);
						box2dBody.SetUserData(new Bug(box2dBody));	
					break;
				}
			
				// default
				if (m != null) {
					// store created objects
					//objectList.push(bodyDef.userData);
					
					bodyDef.position.x = objectX;
				   	bodyDef.position.y = objectY;
	
					fixDef.shape.SetAsBox((objectWidth / this._scaleRatio) / 2, (objectHeight / this._scaleRatio) / 2);
					var box2dBody = this._world.CreateBody(bodyDef).CreateFixture(fixDef);
					
					
				} else {
					//console.log(objectX, objectY);
					//objectList.push(null);
				}
				
				// reset properties:
				//bodyDef.allowSleep = false;
				bodyDef.fixedRotation = false;
				fixDef.isSensor = false;
			}
		}	
	},
	
	_getUserDecorumTileData: function(step, name, alpha, flipV, flipH) {
		flipV = flipV || false;
		var block = new Block(name, step);
		//if (this._wallFlip) {
			block.setFlip(flipH, flipV);
		//}
		if (this._isLightEnable === true) {
			block.setLight(alpha);
		}
		
		// check if it carries some consumable on it:

		return block;
	},
	
	_getBodyAround: function(body) {
		/*
			"33233",
			"32123",
			"21012",
			"32123",
			"33233"
		
		*/
	},
	
	_updateLight: function(body) {
		// from a defined tile (light) set
		// we need to know if the block is static
		this.mapHelper.getCurrentMap();
		
		/*
		var x = 
		
		
		var light = lightnessMap[i][j];
		alpha = (lightnessMap[i][j] == null) ? 0.4 : light/10 + 0.05 * light;
		*/
		
		
		var x = body.GetPosition().x;
		var y = body.GetPosition().y;
		
		
	},
	
	_createFireItem: function() {
		
	},
	
	resetUserMass: function() {
		if (!this.score.fireCount.isReseting()) {
			var us = this._userB2Body;
			var userData = us.GetUserData();
			
	//		userData.mass = userData._mass;
			if (userData.getMode() != 'cursed') {
				userData.setMode('normal');
			}
			
			this._inceptionMode = false;
		}
	},
	
	enforceUserMass: function() {
		var us = this._userB2Body;
		var userData = us.GetUserData();
		//this.bomb(us, 3, 300);
		userData.setMode('destructor');
		this._inceptionMode = true;
		us.SetUserData(userData);
	},
	
	_gotoNextGameFrame: function(callback) {
		if (this._run) {
			this._update();
			this.renderer.drawWorld(this._world);	
			// refresh for the next step:
			this._world.Step(
	        	1 / 60 //frame-rate
	        	, 10 //velocity iterations
	        	, 10 //position iterations
	        );
	        this._world.ClearForces();
			if (this._isRunning) {
				this.timer.tic();
			}
			
		}
		// event run is false, the loop still alive
		if (callback) {
			callback();
		}
	},

    start: function() {
		this._run = true;
		if (this._firstLaunch) {
			this._firstLaunch = false;
			this._launchLoop();
		}
		
    },

	// must be call one time:
	_launchLoop: function() {	
		window.requestAnimFrame = (function() {
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function(callback, element) {
					window.setTimeout(callback, 100 / 60);
				};
		})();

		// LOOP
		var s = this;
		(function loop() {
			window.requestAnimFrame(function() {
				s._gotoNextGameFrame(loop);
			});
		})();
	},

	stop: function() {
		this._run = false;
	},

	restart: function() {
		// stop the game
		this._isRunning = false;
	},
	
	isRunning: function() {
		return this._isRunning;
	},
	
	infect: function(body, radius) {
		var px = body.GetPosition().x;
		var py = body.GetPosition().y;

		var aabb = new b2AABB();
		aabb.lowerBound.Set((px - radius), (py - radius));
		aabb.upperBound.Set((px + radius), (py + radius));
		for (b = this._world.m_bodyList; b; b = b.m_next) {
			var bodyPos = b.GetWorldCenter();
			var yy = (py + 16/this._scaleRatio);
		/*	if (yy > bodyPos.y && yy <= (bodyPos.y + 16/this._scaleRatio)) {
				console.log(b);
			} else {
		*/	
			var name = this._getNameFromb2Body(b);
			if (name != 'bomb' && b !== body) {
				var hitVector = new b2Vec2(bodyPos.x - px, bodyPos.y - py);
				var radDist = hitVector.Normalize();
				if (radDist <= radius){
					b.SetType(b2Body.b2_dynamicBody);
					var userData = b.GetUserData();
					if (userData && typeof userData.infect == 'function') {
						userData.infect();
					}
					//b.ApplyImpulse(appForce, b.GetWorldCenter());
				}
			}

		}
	},

	bomb: function(body, radius, force) {
		var px = body.GetPosition().x;
		var py = body.GetPosition().y;
		
		var aabb = new b2AABB();
		aabb.lowerBound.Set((px - radius), (py - radius));
		aabb.upperBound.Set((px + radius), (py + radius));
		for (b = this._world.m_bodyList; b; b = b.m_next) {
			var bodyPos = b.GetWorldCenter();
			var yy = (py + 16/this._scaleRatio);
		/*	if (yy > bodyPos.y && yy <= (bodyPos.y + 16/this._scaleRatio)) {
				console.log(b);
			} else {
		*/	
			var name = this._getNameFromb2Body(b);
			if (name != 'bomb' && b !== body) {
				var hitVector = new b2Vec2(bodyPos.x - px, bodyPos.y - py);
				var radDist = hitVector.Normalize();
				if (radDist <= radius){
					b.SetType(b2Body.b2_dynamicBody);
					var hitForce = ((radius - radDist) / radius) * force;
//					var appForce = new b2Vec2(-hitVector.x * hitForce, -hitVector.y * hitForce);
					var appForce = new b2Vec2(hitVector.x * hitForce, hitVector.y * hitForce);
					var userData = b.GetUserData();
					if (userData && typeof userData.infect == 'function') {
						userData.infect();
					}
					b.ApplyImpulse(appForce, b.GetWorldCenter());
				}
			}
			
		}
	},
	
    _update: function() {
		if (!this._world) return;
		
		var bomb = false;
		
		/*
		this._counter = (this._counter + 1) % 10;
		if (this._counter == 0) {
			//this.camera.y += 0.2; // using easing could be cool enough
		}
		*/
		/*
		if (this.score.didLevelComplete()) {
			this._endLevel = true;
			var userBody = this._userB2Body;
			if (userBody && userBody.hasOwnProperty('GetUserData')) {
				userBody.GetUserData().kill();
			}
		} else
		// first of all we need to check if the game should continue:
		if (!this.score.didLevelTimeActive()) {
			this._endLevel = true;
			var userBody = this._userB2Body;
			if (userBody && userBody.hasOwnProperty('GetUserData')) {
				userBody.GetUserData().kill();
			}
		*/
		
		if (this.score.isLimitTimeReached()) {
			this._endLevel = true;
			this._userB2Body.SetType(b2Body.b2_staticBody);
		} else {
			var bodyUser = this._userB2Body;
			var offset = 0;
			// iterate through box2d objects
			if (bodyUser.GetLinearVelocity().y > 0.6) {
				this._control.falling = true;						
			} else {
				this._control.falling = false;
			}
			bodyUser.GetUserData().setFalling(this._control.falling);
			if (this._control.falling && bodyUser.GetUserData()._init == true) {
				this._isRunning = true;
			}

			/*
			if (this.camera.y * this._scaleRatio + 240 > (this.mapHelper.getMaxMapHeight() * 16)) {
				// do nothing
				// this.camera.y = 
			} else {
				offset = this.camera.getOffsetY(bodyUser.GetPosition().y);
				this.camera.y += offset;
			}
			*/
			
			offset = this.camera.getOffsetY(bodyUser.GetPosition().y);
			this.camera.y += offset;
			
			this.camera.x = 0;
						
           		var position = {
                x: bodyUser.GetPosition().x,
                y: bodyUser.GetPosition().y - offset
            };
            bodyUser.SetPosition(position);

            var velocity = 0.2;
            if (this._control.canJump) {
                // less velocity
                velocity = 0.6;
            }

            if (this._control.isLeft) {
                bodyUser.SetAwake(true);
                bodyUser.m_linearVelocity.x = Math.max(-5, bodyUser.m_linearVelocity.x - velocity);
            }
            if (this._control.isRight) {
                bodyUser.SetAwake(true);
                bodyUser.m_linearVelocity.x = Math.min(5, bodyUser.m_linearVelocity.x + velocity);
            }

            if (this._control.isUp && !this._control.canJump) {
                bodyUser.SetAwake(true);
                bodyUser.m_linearVelocity.y -= velocity;
            }
            if (this._control.isDown && !this._control.canJump) {
                bodyUser.SetAwake(true);
                bodyUser.m_linearVelocity.y += velocity;
            }
            // JUMP:
            if (this._control.jump && this._control.canJump) {
				bomb = true;
                if (this._control.isRight) {
                    bodyUser.SetAwake(true);
                    bodyUser.m_linearVelocity.x += 1.2;
                }
                if (this._control.isLeft) {
                    bodyUser.SetAwake(true);
                    bodyUser.m_linearVelocity.x -= 1.2;
                }
                this._control.jumping = true;
                this._control.jump = false;
                this._control.canJump = false;

                bodyUser.ApplyImpulse(
                	new Box2D.Common.Math.b2Vec2(0.0, -17),
                	bodyUser.GetWorldCenter()
                );

            } else 
			if (this._control.eat) {
				this._control.eat = false;
				bodyUser.GetUserData().eat();
			}

		//	if (bomb != true) {	
				for (b = this._world.m_bodyList; b; b = b.m_next) {
					name = this._getNameFromb2Body(b);
					
		            if (name != 'hero') {
						position = {
						    x: b.GetPosition().x,
						    y: b.GetPosition().y - offset
						};
						b.SetPosition(position);
					
						// destroy the fallen consumable objects
						if (b.GetUserData() && b.GetUserData().isConsumable()) {
							if (b.GetLinearVelocity().y > 0) {
								b.GetUserData().kill();
							}
						}
					}
				}
	/*		} else {
				bomb = false;
			//	this.bomb(bodyUser, 9);//{x: bodyUser.GetPosition().x * this._scaleRatio, y: bodyUser.GetPosition().y * this._scaleRatio});
			} */
			
			

			// check the current position of camera
			var h = this.camera.y * this._scaleRatio;
			var loadingGap = 300;
			var mapHeight = game.mapHelper.getMapHeight() * 16; // tilesize
			if (h + loadingGap > mapHeight) {
				// http://www.uchidacoonga.com/2011/01/side-scrolling-the-background-in-box2d/
				this._offsetHeight = (mapHeight/this._scaleRatio) - this.camera.y;
				//this.score.addPointLevel(this.mapHelper.getMapOffset() - 1);
				this._createNextDecorum();
			}

			if (this.score.isInceptionModeAllowed()) {
				this.score.fireCount.reset();
				this.enforceUserMass();
			} else {
				this.resetUserMass();
			}

			if (this.score.isButterflyModeAllowed()) {
				this.score.bombCount.reset();
				this._userB2Body.GetUserData().setMode('butterfly');
			//	this.enforceUserMass();
			} else {
				//this.resetUserMass();
			}
		}	
    }

});