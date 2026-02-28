var GameBoard = Class.create({
	initialize: function() {
		this._url = 'http://floriaen.fr/thefall/score.php';
		//this._bestScores = null;
		// store the score into a cache canvas
		this._cvsScore = document.createElement('canvas'); 
	},
	
	debug: function() {
		document.body.appendChild(this._cvsScore);
	},
	
	getScoreBoard: function() {
		return this._cvsScore;
	},
	
	_createCVSCacheScore: function(scores) {
		// this._cvsScore
		var ctx = this._cvsScore.getContext('2d');
		
		ctx.canvas.width = ctx.canvas.width; // clear context
	//	ctx.fillStyle = 'white';
	//	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		
		var i = 0, score = null, x = 0, y = 0, text = '';
		for (i; i < scores.length; i++) {
			score = scores[i];
			game.textHelper.drawText(ctx, 0, 40 * i, '' + (i + 1), 1);
			game.textHelper.drawText(ctx, 30, 40 * i, score.name, 1);
			game.textHelper.drawText(ctx, 210, 40 * i, score.distance + 'm', 1);
		}
	},

	getBestScores: function() {
		var s = this;
		new Ajax.Request(this._url, {
	    	method: 'get',
			parameters: 'pattern=getBestScores',
	    	onSuccess: function(transport) {
	        	var result = transport.responseText;
				if (result) {
					s._createCVSCacheScore(result.evalJSON());
				}
	    	}
		});
	},
	
	save: function(name, distance) {
		if (!name || !distance) {
			this.getBestScores();
		} else {
			var s = this;
			new Ajax.Request(this._url, {
		    	method: 'get',
				parameters: 'pattern=save&name=' + name + '&distance=' + distance,
		    	onSuccess: function(transport) {
					var result = transport.responseText;
					if (result) {
						s._createCVSCacheScore(result.evalJSON());
					}
		    	}
			});	
		}
	}
});