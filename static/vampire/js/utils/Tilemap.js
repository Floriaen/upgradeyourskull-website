function Tilemap() {
	this.data = null;
	this.onload = null;
	this._ready = false;
};

Tilemap.prototype.load = function(tilemap) {
	var self = this;
	_jsonLoader(tilemap, function(jsonFile) {
		console.log(jsonFile);
		self._ready = true;
		self.data = jsonFile;
		if (self.onload) {
			self.onload.call(self);	
		}
	});
};

function _jsonLoader(jsonFile, handler) {
	var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', jsonFile, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4) {
            handler(eval("(" + xobj.responseText + ")"));
        }
    }
    xobj.send(null);
};