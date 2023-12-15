var Score = Class.create(UserData, {
	initialize: function($super, maxLevelTime,  width) {
		$super('score', null);
		
		this.MAX_LEVEL_TIME = 100;
		
		this._score = 0;

		this._collectedCoin = 0;
		this._requestResetFirePointsCounter = false;
		
		this._isHeroCursed = false;
		
		this.fireCount = new PowerElementCount('fire', 5);
		//this.bombCount = new PowerElementCount('flower', 5);	
		
		this._lostTime = 0;
		this._currentLostTime = 0;
		
		this._maxLevelTime = maxLevelTime;
		//this._previousMaxLevelTime = this._maxLevelTime;
		this._currentLevelTime = 1;
		
		//this._progressionColor = ['red', 'orange', 'yellow', '#49E20E'];
		this._graphics.barColor = 0;
		this._graphics.barWidth = 0;
		this._progressionColors = [
			'FF0000', 'FF2A00', 
			'FF5500', 'FF7F00', 
			'FFAA00', 'FFD400', 
			'FFFF00', 'C2F504', 
			'85EB09', '49E20E'
		];
		
		this._displayFinalScore = false;
		this._graphics.masks = {};
		this._finalScore = {};
		this._explodedBomb = 0;
		this._animScoreCount = 0;

		this._scoreBoard = null;		
		this._name = '';
		this._maxBarWidth = width - 60;
		
		
		this.gameBoard = new GameBoard();
		this._lostTimeData = [];

	},
	
	_addExtraTime: function(value) {
		this._extraTime = value;
	},
	
	getName: function() {
		return this._name;
	},
	
	setName: function(name) {
		this._name = name;
	},
	
	save: function() {
		// save couple name / score
	},
	
	getFellDistance: function() {
		// 16 px = 40cm = 0.4m
		return (0.5 + (((game.camera.y * game._scaleRatio)/ 16) * 0.4)) << 0;
	},
	
	getMaxLevelTime: function() {
		return this._maxLevelTime;
	},
	
	isLimitTimeReached: function() {
		return (this._currentLevelTime === 0);
	},
	
	didLevelComplete: function() {
		return false;
		//return this._collectedCoin > 0;
	},
	
	didLevelTimeActive: function() {
		return (this._currentLevelTime > 0)
	},
	
	addCoin: function() {
		this._collectedCoin++;
		// win some extra time
		this._addLostTime(-4); // AWESOME!
	},
	
	displayScore: function() {
		this._animScoreCount = 0;
		this._createBoard();
		this._displayFinalScore = true;
	},
	
	addBomb: function() {
		this._explodedBomb++;
		this._addLostTime(1);
	},
	
	addCure: function() {
		this._addLostTime(-2);
		this._isHeroCursed = false;
	},
	
	addCurse: function() {
		//this._lostTime += 30;
		//this._maxLevelTime -= 30;
		this._isHeroCursed = true;
	},
	
	setScore: function(score) {
		this._score = score;
	},
	
	addPointLevel: function(level) {
		//this._score += 200 * level/2;
	},
	
	isInceptionModeAllowed: function() {
		//return (this.fireCount >= 1)
		return (!this.fireCount.isReseting() && this.fireCount.isMaximumReached())
	},
	
	isButterflyModeAllowed: function() {
		return false;
		//return (!this.bombCount.isReseting() && this.bombCount.isMaximumReached())
	},
	
	_addLostTime: function(value) {
		this._lostTime += value;
		this._currentLostTime += value;
	},
	
	_createBoard: function() {
		this._scoreBoard = new ScoreBoard();
		this._scoreBoard.text('Level complete', 16, 0.5);
		this._scoreBoard.newLine(20);
		
		var scale = 0.43;
		this._scoreBoard.text('Fire collected', 12, scale);
		var f = this._numericToString(this.fireCount.getAllCollectedElements(), 3);
		this._scoreBoard.text(f, 70, scale);

		this._scoreBoard.newLine(10);		
		this._scoreBoard.text('Coin collected', 12, scale);
		var c = this._numericToString(this._collectedCoin, 3);
		this._scoreBoard.text(c, 70, scale);

		this._scoreBoard.newLine(10);		
		this._scoreBoard.text('Bomb impact', 12, scale);
		var b = this._numericToString(this._explodedBomb, 3);
		this._scoreBoard.text(b, 70, scale);

		this._scoreBoard.newLine(10);		
		this._scoreBoard.text('Time remaining', 12, scale);
		var t = this._numericToString(Math.floor(this.getCurrentLevelTime()), 3);
		this._scoreBoard.text(t, 70, scale);

		this._scoreBoard.newLine(20);
		var total = this._numericToString(this._getTotalScore(), 4);
		this._scoreBoard.text('Total score:', 12, scale);
		this._scoreBoard.text(total, 70, scale);
		
		if (total > 200) {
			this._scoreBoard.newLine(20);
			this._scoreBoard.text('you have reached the level 2', 9, 0.36);
		}
	},
	
	_getTotalScore: function() {
		var total = this.fireCount.getAllCollectedElements();
		total += this._collectedCoin * 10;
		total += this._explodedBomb * 5;
		total += this.getCurrentLevelTime();
		total = Math.floor(total);
		return total;
	},
	
	_computeScore: function() {
		this._finalScore = {};
		
		
		this._finalScore['LEVEL COMPLETE'] = '';
		this._finalScore[''] = '';
		this._finalScore['FIRE COLLECTED:'] = this._numericToString(this.fireCount.getAllCollectedElements(), 3);
		this._finalScore['COIN COLLECTED:'] = this._numericToString(this._collectedCoin, 3);
		this._finalScore['BOMB IMPACT:'] = this._numericToString(this._explodedBomb, 3);
	
		this._finalScore['TIME REMAINING:'] = this._numericToString(Math.floor(this.getCurrentLevelTime()), 3);
		
		var total = this.fireCount.getAllCollectedElements();
		total += this._collectedCoin * 10;
		total += this._explodedBomb * 5;
		total += this.getCurrentLevelTime();
		total = Math.floor(total);
		this._finalScore['TOTAL SCORE:'] = this._numericToString(total, 4);
		
		if (total > 200) {
			this._finalScore[''] = '';
			this._finalScore['YOU HAVE REACHED THE LEVEL 1'] = '';
		}
	},
	
	_numericToString: function(num, length) {
		var result = '';
		num = num + '';
		var diff = length - num.length;
		var i = 0;
		for (i; i < diff; i++) {
			result += '0';
		}
		result += num;
		return result;
	},
 	
	getCurrentLevelTime: function() {
		return this._currentLevelTime;
	},

	update: function($super, box2dBody, context) {
		$super(null, context);
		
		
		// something old and not used: (sigh)
		if (this._displayFinalScore === true) {
			if (this._counter == 0) {
				this._scoreBoard.showNextLine();
			}
		} else {
			if (this._counter == 0) {
				this.fireCount.update();	
			}

			if (this._isHeroCursed == true) {
				this._lostTime += 0.01; // damned! This is the curse
			}
			this._currentLevelTime = this._maxLevelTime - Math.max(0, game.timer.getTime() + this._lostTime);
			// this._currentLevelTime = this._maxLevelTime - Math.max(0, game.timer.getTime());
			
			if (this._currentLevelTime > this._maxLevelTime) {
				this._currentLevelTime = this._maxLevelTime;
			}
			
			if (this._currentLevelTime < 0) {
				this._currentLevelTime = 0;
			} else
			if (this._currentLevelTime >= this._maxLevelTime) {
				this._currentLevelTime = this._maxLevelTime;
			}
		
		
			//console.log(this._currentLostTime);
			if (this._currentLostTime != 0) {
				//console.log('add', this._currentLostTime, 0);
				this._lostTimeData.push({
					'time': this._currentLostTime,
					'counter': 0
				});
				
				//	[this._currentLostTime] = 0;
				this._currentLostTime = 0;
			}
			
			// update all lostTimeSet time:
			var tm = null, totalTime = 0;
			var i = 0;
			
			try {
				for (i; i < this._lostTimeData.length; i++) {
					var l = this._lostTimeData[i].counter++;
					totalTime += this._lostTimeData[i].time;
					//console.log('up', this._lostTimeData[i].time, l);
					if (l > 60) {
						//console.log('del', this._lostTimeData[i].time);
						this._currentLevelTime += this._lostTimeData[i].time;
						this._lostTimeData.splice (i,1);
					}
				}
		
			} catch(e) {
				console.log(e, 'ERROR', i, this._lostTimeData);
			}
			/*
			for (tm in this._lostTimeData) {
				totalTime += tm;
				this._lostTimeData[tm]++;
				console.log('up', tm, this._lostTimeData[tm]);
				// time is out
				if (this._lostTimeData[tm] == 10) {
					console.log('del', tm, 0);
					delete this._lostTimeData[tm];
				}
			}
			*/
			this._updateBarColor(totalTime);
		}
	},
	
	_updateBarColor: function(lostTime) {
		
		lostTime = 0; // revert to old stuff
		
		if (lostTime != 0) {
			//console.log(lostTime);
		}
		
		var timeLeft = Math.max(0, this._currentLevelTime - 0.1);
		var ratio = (this._maxBarWidth / this._maxLevelTime);
	
		//var widthScore = (timeLeft - lostTime) * ratio;
		
		var widthScore = 0;
		if (lostTime < 0) {
			widthScore = timeLeft * ratio;
		} else {
			widthScore = (timeLeft - lostTime) * ratio;
		}
		/*
			widthScore 129 timeLeft 97 ratio 1.32
			widthScore 132 timeLeft 100 ratio 1.32		
		*/
		
		this._graphics.lostTimeWidth = (0.5 + Math.abs(lostTime) * ratio) << 0;
		this._graphics.barWidth = (0.5 + widthScore) << 0;
		
	
		//this._graphics.barHeight = '5';
		
		if (this._isHeroCursed == true) {
			this._graphics.barColor = 'gray'; // black
			this._graphics.barLostTimeColor = 'white';
		} else {
			var step = Math.floor(widthScore/(this._maxBarWidth/this._progressionColors.length));
			this._graphics.barColor = this._progressionColors[step];
			
			this._graphics.barLostTimeColor = 'white';
		}
	},
	
	_drawBarOfElements: function(name, count, y) {
		
		var firstXPos = 145;
		var yPos = 8;
		var padding = 8;
		var tileset = game.sprite.getTileset(name);
		var tile = 0;
		
		for (var i = 1; i < 6; i++) {
			this._context.save();
			this._context.translate(firstXPos + (i * tileset.w + padding), yPos + y);
			var tileX = tileset.x + (tileset.w * tile);
			var tileY = tileset.y;
			
			if (i <= count) {
				if (this._isHeroCursed == true) {
					// memoize the created mask:
					if (!this._graphics.masks.hasOwnProperty(name)) {
						this._graphics.masks[name] = CanvasHelper.createAlphaMask(
							[60, 60, 60], tileset.image, tileset.x + tileset.w, tileY, tileset.w, tileset.h
						);
					}
					this._context.drawImage(this._graphics.masks[name], 
						0, 0, tileset.w, tileset.h, 
						-tileset.w/2, -tileset.h/2, 
						tileset.w, tileset.h
					);
				} else {
					this._context.drawImage(
						tileset.image, 
						tileset.x + tileset.w, tileY, tileset.w, tileset.h, 
						-tileset.w/2, -tileset.h/2, 
						tileset.w, tileset.h
					);
				}
			}
			
			this._context.drawImage(
				tileset.image, 
				tileset.x, tileY, tileset.w, tileset.h, 
				-tileset.w/2, -tileset.h/2, 
				tileset.w, tileset.h
			);
			this._context.restore();
		}
	},
	
	draw: function() {
		// override
		
		if (this._displayFinalScore === true) {
			this._scoreBoard.draw(this._context);
		} else {
			this._context.save();
			this._context.fillStyle = 'black';
			this._context.fillRect(2, 5, this._maxBarWidth + 2, 6);
			
			this._context.fillStyle = this._graphics.barColor;
			this._context.fillRect(3, 6, this._graphics.barWidth, 4);
			// lost time
			if (this._graphics.lostTimeWidth > 0) {
				this._context.fillStyle = this._graphics.barLostTimeColor;
				this._context.fillRect(3 + this._graphics.barWidth, 6, this._graphics.lostTimeWidth, 4);
			}
			this._context.restore();

			// element bars
			this._drawBarOfElements('fire', this.fireCount.getCount(), 0);
	//		this._drawBarOfElements('flower', this.bombCount.getCount(), 8);
		}
	}
});