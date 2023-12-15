/*
var _mapsObject = {
	' ': null,
	a: 3, // wall 
	y: 2, // grass
	x: 1, // fixed point
	o: 0 // dynamic point
};
*/
var map = new (
	Class.create({
		
		initialize: function() {
			this._bunches = new Array();
		},
		
		addBunch: function(map, level) {
			level = level || 0;
			//console.log(this._bunches);
			this._bunches.push(map);
		},
		
		
		generate: function(rowCount, level) {
			level = level || 0; // TODO random following level
			rowCount = rowCount || 100;

			var map = new Array();
			// clone and random bunches
			var bunches = this._bunches.clone();
			bunches.sort(function() {
				return (0.5 - Math.random())
			});
			
			var m = null, l = 0;
			while (l < rowCount) {
				m = bunches.shift();
				if (m === undefined) {
					bunches = this._bunches.clone();
					bunches.sort(function() {
						return (0.5 - Math.random())
					});
					m = bunches.shift();
				}
				l += m.size();
				map = map.concat(m);
			}
			// cut the rope :)
			map.slice(0,rowCount);
		
			return map;
		}
	})
);

map.addBunch(
	[
		"ayy        a",
		"aooyy      a",
		"aooxxy     a",
		"aoxxx      a",	
		"aooo    yyya",	
	   	"ao       xxa",
  		"aoo       xa",
        "aoo      ooa",
        "ao      oooa",
        "a        ooa",
		"a         oa"
	]
);

map.addBunch(
	[
		"a          a",
		"aoo      ooa",
		"aooo       a",
		"aoo        a",	
		"ao        oa",	
	   	"a         oa",
  		"a         oa",
        "a        ooa",
        "a      ooooa"
	]
);

map.addBunch(
	[
		"ayy      yya",
		"aoo   yyyooa",
		"aooo  xxxxxa",
		"aoooo  xxxxa",	
		"aooooo  xxoa",	
	   	"aoooooo  ooa",
  		"aooo      oa",
        "aoo      yya",
        "ao       xxa"
	]
);

map.addBunch(
	[
		"ayyyyy     a",
		"aoooo      a",
		"aooo       a",
		"aoo    yyyya",	
		"ao     ooooa",	
	   	"a       oooa",
  		"a        ooa",
        "ay oo     oa",
        "ao oo      a",
    	"ao o o    oa",
    	"ao o o o ooa",
    	"ao o o o oxa",
		"ao o o o ooa"
	]
);   



/*

var maps = [
	
	MapFactory.create(
		[
			"a          a",
			"a        yya",
			"ayoooyyyoooa",
			"axooo  oo  a",
			"a       o  a",
			"a          a",
			"ay         a",
			"ao         a",
			"ayy      ooa",
			"aoxx       a",
			"ao         a",
			"a        o a",				
			"a          a",
			"a          a",
			"ayy      yya",
			"axoox    ooa",
			"aoo     o  a",
			"ao      xo a",
			"ao    oooooa",
			"a        ooa",
			"ayyy     ooa",
			"aoo        a",
			"aoo        a",				
			"a          a",
			"a          a",
			"aoo        a",
			"aoo      ooa",
			"a          a",
			"a          a",
			"a      yyyya",
			"a        ooa",
			"a        oxa",
			"a          a",
			"a  oo   o  a",				
			"ayy    oo  a",
			"aoo        a",
			"aoxo       a",
			"aoooo      a",
			"a         xa",
			"a oo      oa",
			"axoo      oa",
			"aoo       xa",
			"a     xxo xa",				
			"ao         a",
			"ao       ooa",
			"axo       oa",
			"aooo    ooxa",
			"a          a"	
		],
		_mapsObject
	),
	MapFactory.create(
		[
			"a          a",
			"a        yya",
			"ay   yyyoooa",
			"axx o  oo  a",
			"ax      oooa",
			"aooo  oooooa",
			"ay         a",
			"ao       yya",
			"ayy   yyyooa",
			"aoxx   ooooa",
			"aox       oa",
			"ax       ooa",				
			"a          a",
			"a          a",
			"ayy      yya",
			"aoo   yyyooa",
			"aooo  xxxxxa",
			"aoooo  xxxxa",
			"aooooo  xxoa",
			"aoooooo  ooa",
			"aooo      oa",
			"aoo      yya",
			"ao       xxa",				
			"a          a",
			"a          a",
			"aoy        a",
			"aooyy    ooa",
			"axxxxo     a",
			"aooo       a",
			"aoo    yyyya",
			"ao     ooooa",
			"a        oxa",
			"a          a",
			"a  oo   o  a",				
			"ayy    oo  a",
			"aoo    xx  a",
			"ao         a",
			"a          a",
			"a  yyyy    a",
			"a ooooo    a",
			"axooo      a",
			"aooo       a",
			"axx        a",				
			"ao         a",
			"ao    yyyooa",
			"a      ooooa",
			"a       ooxa",
			"a          a"	
		],
		_mapsObject
	),
	MapFactory.create(
		[
			"a          a",
			"a        yya",
			"ayoooyyyoooa",
			"axooo  oo  a",
			"a       o  a",
			"a          a",
			"ay         a",
			"ao         a",
			"ayy      ooa",
			"aoxx       a",
			"ao         a",
			"a        o a",				
			"a ooo      a",
			"a          a",
			"ayy      yya",
			"axoy     ooa",
			"aoo     o  a",
			"ao      xo a",
			"ao    yyoooa",
			"a        ooa",
			"ayyy     ooa",
			"aoo        a",
			"aoo        a",				
			"aooo  oooooa",
			"aooo    oooa",
			"aooo     ooa",
			"aooo  oooooa",
			"aoooo  ooooa",
			"aoooo      a",
			"a      yyyya",
			"a        ooa",
			"a        oxa",
			"a          a",
			"a  oo   o ya",				
			"ayy    oo  a",
			"aoo        a",
			"aoxo       a",
			"aoooo    yya",
			"a     ooooxa",
			"a oo    oooa",
			"axoo      oa",
			"aoo       xa",
			"a     xxo xa",				
			"ao         a",
			"ao       ooa",
			"a         oa",
			"a        oxa",
			"a          a"	
		],
		_mapsObject
	),
	MapFactory.create(
		[
			"a          a",
			"a        yya",
			"a         oa",
			"a          a",
			"a       oooa",
			"a       oooa",
			"ayyy     ooa",
			"aooo      oa",
			"ayy      ooa",
			"aoxx    oooa",
			"ao         a",
			"a        o a",				
			"a          a",
			"a          a",
			"ayy      yya",
			"ax  x    ooa",
			"aoo     o  a",
			"ao      xo a",
			"ao    oooooa",
			"a      ooooa",
			"ayyy    oooa",
			"aooo     ooa",
			"aoo        a",				
			"ao         a",
			"a          a",
			"a          a",
			"a        ooa",
			"ayyy       a",
			"aoo        a",
			"ao     yyyya",
			"a        ooa",
			"a        oxa",
			"a          a",
			"a          a",				
			"ay         a",
			"ao   yyyyyya",
			"ao     ooooa",
			"ao       ooa",
			"a         xa",
			"a oo      oa",
			"axoo      oa",
			"aoo       xa",
			"a     xxo xa",				
			"ao         a",
			"ao       ooa",
			"a         oa",
			"ao      ooxa",
			"a          a"	
		],
		_mapsObject
	),
	MapFactory.create(
		[
			"a          a",
			"a        yya",
			"a         oa",
			"a          a",
			"a       oooa",
			"a          a",
			"ay         a",
			"ao         a",
			"ay         a",
			"ao         a",
			"ao         a",
			"a          a",				
			"a          a",
			"a          a",
			"ay         a",
			"ax         a",
			"ao         a",
			"ao         a",
			"ao    o    a",
			"a    o ooooa",
			"ay      oooa",
			"aoooo    ooa",
			"aooo     ooa",				
			"aoo  ooo  oa",
			"ao ooo   ooa",
			"a   ooo oooa",
			"a  ooooo  oa",
			"ay         a",
			"ao         a",
			"ao         a",
			"a          a",
			"a      ooooa",
			"a       oooa",
			"a        ooa",				
			"ay        oa",
			"ao         a",
			"ao        oa",
			"ao        oa",
			"a         xa",
			"a         oa",
			"ax        oa",
			"ao        xa",
			"a         xa",				
			"ao         a",
			"ao        oa",
			"a         oa",
			"ao      ooxa",
			"a          a"	
		],
		_mapsObject
	),
	MapFactory.create(
		[
			"a          a",
			"a        yya",
			"a         oa",
			"a          a",
			"a       oooa",
			"ay y  y  y a",
			"axo x   o xa",
			"ao o   o o a",
			"ayo     o oa",
			"ao     o x a",
			"a o   o o oa",
			"ao o     x a",				
			"a          a",
			"a          a",
			"ay         a",
			"ax         a",
			"ao         a",
			"ao         a",
			"ao    o    a",
			"a    o ooooa",
			"ay      oooa",
			"aoooo    ooa",
			"aooo       a",				
			"aoo        a",
			"ao o       a",
			"a          a",
			"a  o       a",
			"ayyyyy     a",
			"aoooo      a",
			"aooo       a",
			"aoo    yyyya",
			"ao     ooooa",
			"a       oooa",
			"a        ooa",				
			"ay oo     oa",
			"ao oo      a",
			"ao o o    oa",
			"ao o o o ooa",
			"ao o o o oxa",
			"ao o o o ooa",
			"ax      oooa",
			"ao      yyxa",
			"a       xxxa",				
			"ao      xxxa",
			"ao       xoa",
			"a         oa",
			"ao      ooxa",
			"a          a"	
		],
		_mapsObject
	)
];


 	



*/









