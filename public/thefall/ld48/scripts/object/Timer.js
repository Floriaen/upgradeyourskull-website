var Timer = Class.create({
	initialize: function(maxStep) {
		this._lastTimestamp = 0;
		this._maxStep = maxStep;
		this.time = 0;
		this.fps = 0;
	},
	
	getTime: function() {
		return Math.max(0, this.time - this._maxStep);
	},
	
	tic: function() {
		var current = Date.now();
        var delta = (current - this._lastTimestamp) / 1000;
        this.time += Math.min(delta, this._maxStep);
//        this.time -= this._maxStep

		var thisFrameFPS = 1000 / (current - this._lastTimestamp);
		this.fps += (thisFrameFPS - this.fps) / this._maxStep;
		
		this._lastTimestamp = current;
	}
});