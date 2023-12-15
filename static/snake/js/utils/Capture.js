/////////////////////////////////////
// Be carefull, this is a dirty code.
// Read it at your own risk
// ©floriaen 2012
//////////////////////////////////

var Capture = {
	cc: null,
	started: false,
	start: function() {
		if (!Capture.cc) {
			this.cc = new CanvasCapture({
		    	debug: false,
		    	fps: 4,
		    	inCanvasEl: document.getElementsByTagName('canvas')[0]
			});
		}
		this.cc.start();
		this.started = true;
	},
	stop: function() {
		this.cc.stop();
		this.started = false;
	},
	toogle: function() {
		if (this.started) {
			this.stop();
		} else {
			this.start();
		}
	}
};

