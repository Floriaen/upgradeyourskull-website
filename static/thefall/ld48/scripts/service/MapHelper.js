var MapHelper = Class.create({
	initialize: function(maps, maxMapHeight) {
		this._cloningMaps = [];
		this._maps = [];
		this._maxMapHeight = maxMapHeight;
		
		this._firstMap = null;
		this._lastMap = null;
//		this._mapOffset = 1;
		this._mapHeight = 0;
		
		var convertedMap = null, 
			self = this;
		maps.each(function(map) {
			convertedMap = self._convert(map);
			if (convertedMap) {
				self._maps.push(convertedMap);
			} // TODO error?
		});	
		
		this._currentMap = null;
		
		// diffusion of light throught tiles
		this._mapOfLightness = [
			"33233",
			"32123",
			"21012",
			"32123",
			"33233"
		];
	},
	
	getMaxMapHeight: function() {
		return this._maxMapHeight;
	},
	
	setBoundMaps: function(firstMap, endMap) {
		var convertedMap = this._convert(firstMap);
		this._firstMap = convertedMap;
		
		convertedMap = this._convert(endMap);
		this._lastMap = convertedMap;
	},
	
	/*
		create a two dimensional array from a one with only one dimension
	*/
	_convert: function(map) {
		// TODO check length for each line
		var convertedMap = null;
		if (map.map.size() > 0) {
			var line = null,
				len = map.map[0].length;
			convertedMap = [];
			var i, j;
			for (i = 0; i < map.map.size(); i++) {
				line = [];
				for (j = 0; j < len; j++) {
					var point = map.map[i][j];
					if (map.def.hasOwnProperty(point)) {
						line.push(map.def[point]);						
					} else {
						throw 'no definition found for point ' + point;
					}
				}
				convertedMap.push(line);
			}
		}
		return convertedMap;
	},
	
	getMap: function(idx) {
		return this._maps[0];
	},
	
	isNextMapLastMap: function() {
		//console.log(this.getMapHeight(), this._maxMapHeight);
		//return ((this.getMapHeight() + 50) > this._maxMapHeight);
		return false;
	},
	
	// return the height of the dynamic map
	// in a minutes it will probably not the same
	getMapHeight: function() {
		return this._mapHeight;
	},
	
	getNextMap: function() {
		var map = null;
		if (this._mapHeight === 0) {
			map = this._firstMap;
		} else
		if (this.isNextMapLastMap()) {
			var diffHeight = this._maxMapHeight - this.getMapHeight();
		//	console.log(diffHeight);
			// map = this._lastMap;
			// map should have this length
			var i = 0;
			map = [];
			for (i = 0; i < diffHeight - 3; i++) {
				map.push(this._lastMap[0]);
			}
			map.push(this._lastMap[1]);
			map.push(this._lastMap[2]);
			map.push(this._lastMap[3]);
			map.push(this._lastMap[4]);
			map.push(this._lastMap[5]);
		/*} 
		
		
		else
		if (this.getMapHeight() > this._maxMapHeight) {
			debugger;
		/*
			// TODO end...
			var diffHeight = this._maxMapHeight - this.getMapHeight();
			// we should create a last dynamic map:
			
			
			// get the last line of the last map
			var line = this._lastMap[this._lastMap.size() - 1];
			map = [];
			var i;
			for (i = 0; i < this._lastMap.size(); i++) {
				map.push(line);
			}
			*/
		} else {
			map = this.getRandomMap();
		}
		
		this._setCurrentMap(map);
		return map;
	},
	
	_setCurrentMap: function(map) {
		this._currentMap = map;
//		this._mapOffset++;
		this._mapHeight += map.length;
	},
	
	getCurrentMap: function() {
		return this._currentMap;
	},
	
	getRandomMap: function() {
		if (this._cloningMaps.length === 0) {
			this._cloningMaps = this._maps.clone().shuffle();
		}
		//var r = Math.ceil(Math.random() * (this._cloningMaps.size() - 1));
		return this._cloningMaps.shift();
	},
	
	constructAndGetMap: function() {
		var arr = this._maps[0];
		var i;
		for (i = 1; i < this._maps.size(); i++) {
			arr = arr.concat(this._maps[i]);
		}
		return arr;
	},
	/*
	         2
            212			
		   21012
            212	
	         2
	*/
	createLightnessMap: function(map, lights) {
		// 0, 1, 2, 3
		var m = map;
		var p = null;
		var mapOfLights = [];
		
		var i, j, l;
		for(i = 0; i < m.length; i++) {
			l = [];
            for(j = 0; j < m[i].length; j++) {
				l.push(3);
			}
			mapOfLights.push(l);
		}
		
		for(i = 0; i < m.length; i++) {
			for(j = 0; j < m[i].length; j++) {
				p = m[i][j];
				if (lights.indexOf(p) >= 0) {
					mapOfLights[i][j] = 0;
					// then we get point all around and define the light
					var i1 = i - 2; // origin
					var j1 = j - 2;
					this._copySubMap(i1, j1, this._mapOfLightness, mapOfLights);
				} 
			}
		}
		return mapOfLights;
	},
/*	
	
	updateLightOfBox2dWord: function(world, lights) {
		var b = null;
		var userData = null, name = null;
		
		for (b = world.m_bodyList; b; b = b.m_next) {
			userData = b.GetUserData();
			if (userData) {
				//userData.name
				userData.setLight(this._getAlphaForLightLevel(3));
			}
		}
		
		for (b = world.m_bodyList; b; b = b.m_next) {
			userData = b.GetUserData();
			if (userData) {
				name = userData.name
				if (lights.indexOf(name) >= 0) { // it's a light
					this._updateLightAllAround(b);	
				}
			}
		}
	},
	
	
	
	_updateLightAllAround: function(body) {
		var i = 0;
		for (i = 0; i < 5; i++) {
			for (j = 0; j < 5; j++) {
				
			}
		}
		
		
		var next = body.m_next;
		
		var prev = body.m_prev;
		if (prev) {
			prev
		}
	},
	
	_getAlphaForLightLevel: function(level) {
		var alpha = 0;
		alpha = (level[i][j] == null) ? 0.4 : level/10 + 0.05 * level;
	},
	
*/
	
	// copy map into externalMap
	_copySubMap: function(oi, oj, map, externalMap) {
		var i, j, p;
		for(i = 0; i < map.length; i++) {
			for(j = 0; j < map[i].length; j++) {
				p = map[i][j];
				this._setPointAtMap(p, oi + i, oj + j, externalMap); // set the alpha
			}
		}
	},
	
	_setPointAtMap: function(p, i, j, map) {
		// we are outside the bounds:
		if (i >= 0 && i < map.length) {
			if (j >= 0 && j < map[i].length) {
				if (map[i][j] == null || map[i][j] > p) {
					map[i][j] = p;
				} else {
					// max is 3, min is 1 
					map[i][j] = map[i][j] - 1/p;
				}// else should I compute? TODO
			}
		} 
	},
	
	_getPointFromMap: function(i, j, map) {
		var p = null;
		// we are outside the bounds:
		if (i < 0 || i >= map.length) {
			p = null;
		} else
		if (j < 0 || j >= map[i].length) {
			p = null;
		} else {
			p = map[i][j];
		}
		return p;
	}
	
});

var MapFactory = {
	create: function(map, def) {
		return {
			map: map,
			def: def
		};
	}
};