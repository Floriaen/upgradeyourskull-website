var _mapsObject = {
	' ': null,
	z: 13, // invisible	
	u: 12, // invisible
	h: 11, // head
	g: 10,
	r: 9, // curse
	c: 8, // cure
	
	i: 7, // flower
	'%': 6, // fire
	
	e: 5, // head
	b: 4, // falling grass
	a: 3, // wall
	y: 2, // grass
	x: 1, // fixed point
	o: 0 // dynamic point
};

var mapGenerator = new (
	Class.create({
		initialize: function(height) {
			this._level = 0; // 1, 2
			//this._bunches = new Array();
			this._maps = null;
			this._height = height;
		},
		
		getTilesetName: function(tile) {
			var tileset = null;
			switch (tile) {
				case 'o':
					tileset = 'dirtFixedB';
				break;
				case 'x':
					tileset = 'dirtB';
				break;
				case 'y':
					tileset = 'grassB';	
				break;
				case 'a':
					tileset = 'block';
				break;
				case 'b':
					tileset = 'fallingGrassB';
				break;
				/*
				case 'e':
					tileset = 'dirtFixed';
				break;
				*/
			}
			return tileset;
		},
		
		setMaps: function(maps) {
			this._maps = maps;
			/*
			maps.first
			maps.last
			maps.bunches
			*/
		},
		
		getFirstMap: function() {
			// get the begin map
			var map = this._maps['first'];
			return map;
			/*
			var len = map.size();
			var l = this._height - len;
	
			var pad = this.generate(l);
			var out = map.concat(pad);
			return out;
			*/
		},
		
		getLastMap: function() {
			// get the last map
			var map = this._maps['last'];
			
			/*
			var len = map.size();
			var l = this._height - len;
			var pad = this.generate(l);
			return pad.concat(map);
			*/
			return map;
		},
		
		// helper 
		_symetry: function(map) {
			var symetryMap = map.concat();
			var i, j, l, line;
			for (i = 0; i < map.length; i++) {
				l = map[i].length;
				line = '';
				for (j = 0; j < l; j++) {
					line += map[i][l - 1 - j];
				}
				symetryMap[i] = line;
			}
			return symetryMap;
		},
		
		getRandomMap: function() {
			return this.generate(this._height);
		},
		/*
		addBunch: function(map, level) {
			level = level || 0;
			//console.log(this._bunches);
			this._bunches.push(map);
		},
		*/
		
		_getLengthOfBunches: function(bunches) {
			var i, l = 0;
			for (i = 0; i < bunches.length; i++) {
				l += bunches[i].length;
			}
			return l;
		},
		
		_generateNewBunches: function() {
			this._bunches = this._maps.bunches.clone();
			this._bunches.sort(function() {
				return (0.5 - Math.random())
			});
		},
		
		// get a map of at least rowCount length 
		generate: function(rowCount, level) {
			level = level || 0; // TODO random following level
			rowCount = rowCount || 100;

			var map = new Array();
			
			// to be sure two same bunches
			// will not encountered too frequently:
			if (this._bunches) {
				var l = this._getLengthOfBunches(this._bunches);
				if (l < rowCount) {
					this._generateNewBunches();
				}
			} else {
				this._generateNewBunches();
			}

			var m = null, l = 0;
			while (l < rowCount) {
				m = this._bunches.shift();
				if (m === undefined) {
					this._generateNewBunches();
					m = this._bunches.shift();
				}
				l += m.size();
				
				// random 
				var test = Math.floor(Math.random() * 2);
				var newMap = null;
				if (test == 0) {
					newMap = m;
				} else {
					newMap = this._symetry(m)
				}
				map = map.concat(newMap);
			}

			return map;
		}
	})
)(50);

var Resources = {
	background: []
};
Resources.background[0] = [
	"               ",
	"               ",
	" yyyy          ",
	"xxxxxybbbbbbbby",
	"xxxxxxx  ooxxxx",
	"xxooooox  oxxxx",
	" xxo  ox xxxxx ",
	"xxx    oxxxx   ",
	"xxxx   xxxx    ",
	" x xx xxx      ",
	"     xxxx      ",
	"      xx       ",
	"               ",
	"               ",
	"               ",
	"               ",
	"yybbbbby       ",
	"xoooooox       ",
	"xxxxxx    yyyyy",
	"xxxx    xxxxxxx",
	"xxx   xxxxxxoo ",
	"       oooooo  ",
	"       oooox   ",
	"         oo    ",
	"               ",
	"               ",
	"               ",
	"               ",
	"               ",
	"ybbbyyyyy      ",
	"xx xxxoo       ",
	"oo  xx         ",
	"               ",
	"yyy    bbbbbbbb",
	"xxxx   xxoooooo",
	"x       xxxoooo",
	"         xxxxxx",
	"              x",
	" yy      yyyx  ",
	"  xxyy bbxxxxxx",
	"   xxx xxxxxxxx",
	"    xxooooooxxx",
	"     xooooxxxxx",
	"       xoxx    ",
	"        xo     ",
	"               ",
	"               ",
	"          yy   ",
	"         yxxy  ",
	"         xxxxxy",
	"     yyyyxxxxxx",
	"  xxxxxxoooooxx",
	"     xxxxxxxxx ",
	"       oooxxx  "	
];

Resources.background[1] = [
	"                             ",
	"                             ",
	" yyyy           yyy          ",
	"xxxxxybbbbbb    xxxybbbbbbbby",
	"xxxxxxx  oox    xxxxx  ooxxxx",
	"xxooooox  ox    ooooox  oxxxx",
	" xxo  ox xxx    xo  ox xxxxx ",
	"xxx    oxxxx    x    oxxxx   ",
	"xxxx   xxxx     xx   xxxx    ",
	" x xx xxx        xx xxx      ",
	"     xxxx          xxxx      ",
	"      xx            xx       ",
	"                             ",
	"                             ",
	"                             ",
	"                             ",
	"yybbbbby         bbbby       ",
	"xoooooox         oooox       ",
	"  oxxx    y    xxxxx    yyyyy",
	"   x    xxx    xxx    xxxxxxx",
	"      xxxx      x   xxxxxxoo ",
	"       ooo           oooooo  ",
	"       ooo           oooox   ",
	"         oo            oo    ",
	"                             ",
	"                             ",
	"                             ",
	"                             ",
	"                             ",
	"ybbbyy        ybbbyyyyy      ",
	"xxxxxx        xxxxxxoo       ",
	"oooox                        ",
	"                             ",
	"yyy       bbbbb      yyy bbbb",
	"xxxx   xxoooo        xxxboooo",
	"x       xxxxxyyy      oxxoooo",
	"         xxxxxx         xxxxx",
	"            ooooo           x",
	" yy      y   oo      yyyyyx  ",
	"  xxyy bbx    o       xxxxxxx",
	"   xxx xxx             xxxxxx",
	"                        xoxxx",
	"                   yyyyyxxxxx",
	"       xoxx         oxoxx    ",
	"        xo            xo     ",
	"                             ",
	"                             ",
	"          yy            yy   ",
	"         yxxy          yxxy  ",
	"         xxxxx         xxxxxy",
	"     yyyyxxxx  yyy   yyxxxxxx",
	"  xxxxxxooxx  xxxx xxxoooooxx",
	"     xxxxxx    xx   xxxxxxxx ",
	"       ooo           oooxxx  "	
];

mapGenerator.setMaps({
	
	/*
	'first': [
		"            ",
		"            ",
		"            ",
		"            ",	
		"            ", 
		"            ",	
		"            ",	
		"            ",
		"            ",
		"            ",
		"  x     x   ",
		"  xxxxxxx   ",	
		"  xxxxxxx   ", 
		"  xxxhxxx   ",	
		"  xxxxxxx   ",
		"  xxxxxxx   ",
		"            ",
		"            ",
		"            ",	
		"            ", 
		"            ",	
		"            "   
	],
	*/
	/*
	'first': [
		"            ",
		"            ",
		"            ",
		"            ",	
		"            ", 
		"            ",	
		"            ",	
		"    h%      ",	
		"    yyyy    ",	
		"    xxo     ",	
		"     o      ",	
		"            ",
		"            ",
		"            ",
		"            ",	
		"            ",	
		"            ",										
		"            ",  
		"            ",
		"           a",										
		"         yya",
		"         xxa",
		"          xa",
		"           a",
		"a       %  a",
		"a    yyyy  a",
		"ar    xxxi a",
		"ayy g  xxy a",
		"axxyy   x  a",
		"axxx       a",
		"axx        a",
		"a        ira",
		"a   %   yyya",
		"aicyy    xxa",
		"ayyx      xa",				
		"axxx       a",
		"axx        a",
		"ax         a",
		"a          a"
	],
	*/
	
	'first': [
		"            ",
		"            ",
		"            ",
		"            ",	
		"            ", 
		"            ",	
		"            ",	
		"    h%      ",	
		"    yyyy    ",	
		"    xxo     ",	
		"     o      ",	
		"            ",
		"            ",
		"            ",
		"            ",
		"            ",	
		"            ",	
		"            ",										
		"            ",  
		"           a",
		"a          a",
		"a          a",
		"ay         a",
		"axy        a",
		"aoxyy   %  a",
		"a ox   yyyya",
		"a x     x  a",
		"axx      x a",
		"ax        xa",
		"ax   r    xa",
		"axyyyyyyyyxa",				
		"axxxx  xxxxa",
		"axxx    xxxa",
		"axx      xxa",
		"ax        xa",
		"a  c   g yxa",
		"a  yyyyyyxxa",
		"a   xxxxxxxa",
		"a    x    xa",
		"a          a",
		"a %      % a",
		"ayy      yya",
		"ax        xa",
		"axy  i   yxa",
		"axxyyyyyyxxa",
		"axx      xxa",
		"ax        xa",
		"a          a",
		"a          a" 
	],
	
	
	
	
	/*
	'first': [
		"a        i a",
		"a%   i   yya",
		"ay   yyyxxxa",
		"axx x  xx  a",
		"ax     xxxxa",
		"axxx  xxxxxa",
		"ay         a",
		"ax     % yya",
		"ayy   yyyxxa",
		"axxx   xxxxa",
		"axx       xa",
		"ax       xxa",				
		"a          a",
		"a          a"
	],
	
	*/
	
	'last': [
		"a          a",
		"a  c       a",
		"yyyyyyyyyyyy",
		"xxxxxxxxxxxx"
	],
	
	'bunches': [
		[
			"a          a",
			"ayy i      a",
			"axxyy      a",
			"axxxxb     a",
			"axxxo   % ia",	
			"axxo    yyya",
			"a          a"
		],
		
		[
			"a          a",
			"ay      i  a",
			"ayg     yxxa",
			"axy     xxxa",
			"axo     oxxa",
			"ao       oxa",
			"ax        xa",
			"axc      ixa",
			"axx    r%xxa",	
			"axxo  oxxxxa",
			"a          a",
		],
		
		[
			"a          a",
			"ay      i  a",
			"ayg     y  a",
			"axy     x  a",
			"axo     x  a",
			"a        x a",
			"a    y     a",
			"a c  x   i a",
			"a x  x r%x a",	
			"a oo   xxx a",
			"a          a",
		],
		
		[ 
			"a          a",
			"a    yy    a",
			"a     x    a",
			"a r%       a",
			"ayyy       a",
			"axx        a",
			"ax         a",
			"a       ci a",
			"ag      yyya",
			"ay       xxa",
			"a         xa",
			"a          a" 
		],
		
		[  	
			"a          a",
			"ax       xxa",
	  		"axx       xa",
	        "axx      oxa",
	        "ax      oxxa",
	        "a        oxa",
			"a         xa"
		],
		
		[
			"a g        a",
			"ayy        a",
			"axxyy    yya",
			"axg xy   oxa",
			"axx xx     a",	
			"ax         a",	
		   	"a          a",
	  		"a          a",
	        "a          a"            
		],
		
		[
			"a          a",	
			"a          a",	
			"a        c a",	
			"a %      yya",
			"ayy      xxa",
			"axxo       a",
			"axo       ga",	
			"ax        xa",
			"a          a",	
			"a          a",	
			"a          a" 
		],
		
		[	
		   	"a         xa",
	  		"a         xa",
	        "ac     i xxa",
	        "ay     yxxxa",
			"ax      oxxa",	
			"a        oxa",	
			"a          a",
		],
		
		[	
		   	"a          a",
	  		"a          a",
	        "a  r%      a",
	        "a  yy      a",
			"a yxxy     a",
	  		"a  xx      a",
	        "a         ga",
	        "a         ya",
			"a  ic      a",
	  		"a  yy      a",
	        "a  xx      a",
	        "a          a"
		],
		
		[	
		   	"a          a",
	  		"a          a",
	        "a yyy  yyy a",
	        "a x     xx a",
			"a x      x a",
	  		"a x      x a",
	        "a x      x a",
	        "a x%     x a",
			"a xyy  yyx a",
	  		"a          a",
	        "a          a" 
                       
		],
		
		[
			"ayy    % yya",
			"axx   yyyxxa",
			"a xoc xx  xa",
			"a  xo  xx xa",	
			"a   oo  x xa",	
		   	"a  g oo  xxa",
	  		"a xx     ixa",
	        "axx      yya",
	        "ax       xxa"
		],
		
		[	
		   	"a          a",
	  		"a      r% ia",
	        "a      yyyya",
	        "a      oxxxa",
			"a       oxxa",
	  		"a        oxa",
	        "a          a",
	        "a          a",
			"a          a",
	  		"a          a",
	        "a          a",
	        "a          a",
			"ac i       a",
	  		"ayyy       a",
	        "axxx       a",
	        "axx        a",
			"a          a",
			"a          a"
		],
		
		[	
		   	"a          a",
	  		"a  g    g  a",
	        "ayyy    yyya",
	        "axx      xxa",
			"a r      % a",
	  		"ay       yya",
	        "ax        xa",
	        "ax        xa",
			"axy      yya",
	  		"ax        xa",
	        "a  %    ic a",
	        "ayyy    yyya",
			"ax   i    xa",
	  		"ax  oyyx  xa",
	        "ax   xx   xa",
	        "a          a",
			"a          a",
			"a          a"
		],     
		
		[ 
   
		   	"a          a",
	        "a  %       a",
	        "a  y    yi a",
			"a yxy  yxy a",
	  		"a  x    x  a",
			"a          a",
	        "a  i       a",
			"a  y   %y  a",
	  		"a yxy  yxy a",
	        "a  x    x  a",
			"a          a",
	        "a  %    i  a",
			"a gyr   y  a",
	  		"a xxy  yxy a",
	        "a  x    x  a",
			"a          a",
	        "a          a",
	        "a  y   iy  a",
			"a yxy  yxy a",
	  		"a  x    x  a",
			"a          a",
	        "a          a",
			"a          a",
	  		"a  g ir    a",
	        "a  yyyyyy  a",
			"a  xxxxxx  a",
			"a  x    x  a",
			"a          a"
		],
		
		[	
			"a          a",
	  		"a          a",
	        "a          a",
		   	"a          a",
	  		"a          a",
	        "a          a",
			"a      ri  a",
	  		"a      yyyya",
	        "a       oxxa",
	        "a        oxa",
			"a %       oa",
	  		"ayyy       a",
	        "axx        a",
	        "ax         a",
			"a        yya",
	  		"a    i y xxa",
			"a    y    xa",
		   	"a  y       a",
			"ay         a",
		   	"a          a",
		],
		
		[
			"ax         a",
			"a        yya",
	  		"a    r y xxa",
			"a    y    xa",
		   	"ac         a",
			"ay         a",
		   	"a          a",
			"ax         a",
			"a        yya",
	  		"a    i y xxa",
			"a    y    xa",
		   	"a          a",
			"ay         a",
		   	"a          a",
			"ax         a",
			"a        yya",
	  		"a    c   xxa",
			"a    y    xa",
		   	"a  y       a",
			"ay         a",
		   	"a          a",
			"ax       g a",
			"a        y a",
	  		"a    %     a",
			"a    y     a",
		   	"a  y       a",
			"ay         a",
		   	"a          a"
		
		], 
		
		[	
		   	"a          a",
	  		"a          a",
	        "a i r    c a",
			"ayyyy    yya",
	  		"axxx     xxa",
	        "axx     yx a",
	        "ax    %yx  a",
			"a     yx  xa",
	  		"a          a",
	        "a         %a",
			"a         ya",
			"a         xa",
	        "ac y       a",
			"ayyx       a",
	  		"axx        a",
			"a          a", 
			"a          a"    
		],		  
		
		[	
		   	"a          a",
	  		"a          a",
	        "a          a",
			"a          a",
	  		"a        r%a",
	        "a       yyya",
	        "a        xxa",
			"a  %      xa",
	  		"a  y       a",
	        "a          a",
	        "ac         a",
			"ax         a",
	  		"a          a"
		],
		
		[	
		   	"a          a",
	  		"a x      x a",
	        "ax        xa",
			"a    bb    a",
	  		"a  cbooy%  a",
	        "a iyo  xyr a",
	        "agyx    xy a",
			"ayx      xya",
	  		"ax        xa",
	        "a          a",
	        "a   i  i   a",
			"a  yy  yy  a",
	  		"a  xx  xx  a",
			"a          a",
			"a          a" 
		],
		
		[	
		   	"a          a",
	  		"a          a",
	        "a          a",
			"a    yy    a",
	  		"a  cxxxy%  a",
	        "a  yx  xy  a",
	        "a  x    x  a",
			"a          a",
	  		"a          a",
	        "a          a",
	        "a   i  i   a",
			"a  yy  yy  a",
	  		"a  xx  xx  a",
			"a          a",
			"a          a" 
		],
		
		[	
		   	"a          a",
	  		"ag        %a",
	        "ay        ya",
			"axy      yxa",
	  		"a xr    rx a",
	        "a  x    x  a",
	        "a          a",
			"a   oooo   a",
			"a     o    a",
			"a          a",
			"a          a",
			"a  i    i  a",
	  		"a  y    y  a",
	        "a  x    x  a",
	        "a b      b a",
			"abo      oba",
	  		"ao        oa",
			"aobb    bboa",
			"a oo    oo a" 
		],
		
		[
			"a          a",
			"a          a",
			"a%        %a",
			"ay        ya",
			"ax        xa",
			"a   %  %   a",
			"a  cy  yc  a",
			"a  yx  xy  a",
	  		"abyx    xyba",
	        "ayx      xya",
	        "axx      xxa",
			"axx%    %xxa",
	  		"a xx    xx a",
			"a  x    x  a",
			"a          a",
			"a          a",
			"a          a",
			"a          a",
			"a          a"						
		],
		
		
		[
			"a          a",
			"a    g     a",
			"a    yyi   a",
	  		"a  %yxxyi  a",
	        "a  yxooxy  a",
	        "a  xoooox  a",
			"a   xoox   a",
	  		"a    xx    a",
			"a          a"
		],
		
		[	
			"a          a",
			"a          a",
		   	"a        g a",
	  		"a y      y a",
	        "a xo oo ox a",
			"a          a",
	  		"a   o  o   a",
	        "a          a",
	        "a    bb    a",
			"a    xx    a",
	  		"a    x     a",
	        "a r     c  a",
	        "a xx    xx a",
			"a  x    x  a",
	  		"a          a",
			"a          a",
		],
		
		[	
			"a          a",
			"a c        a",
		   	"a y        a",
	  		"a x        a",
	        "a     %    a",
			"a     y    a",
	  		"a     x    a",
	        "a        i a",
	        "a        y a",
			"a        x a",
	  		"a          a",
	        "a   g      a",
	        "a   y      a",
			"a   x     ra",
	  		"a         ya",
			"a         xa",
			"a y        a",
	        "a x        a",
			"a          a",
			"a          a" 
		]
		
	/*
		[
			"axxxx  xxxxa",
			"axxx    xxxa",
		    "axx      xxa",
			"ax   yyi  xa",
	  		"a  %xxxxi  a",
	        "a  xxxxxx  a",
	        "a  xxxxxx  a",
			"a   xxxx   a",
	  		"ax   xx   xa",
			"axx      xxa",
			"axxx    xxxa",
			"axxxx  xxxxa"
		]
	*/
	
	]
});

/*
mapGeneratxr.addyunch(
	[
		"ayy        a",
		"axoyy      a",
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

mapGenerator.addyunch(
	[
		"ayy        a",
		"aooyy    yya",
		"aooooy   ooa",
		"aoxxxx     a",	
		"a          a",	
	   	"a          a",
  		"a          a",
        "a          a"            
	]
);

// long tunnel
mapGenerator.addyunch(
	[
		"ayyy       a",
		"axxx      ya",
		"axxxy    yxa",
		"axxxxy  yxxa",	
		"axxxxx  xxxa",	
	   	"axxxxx  xxxa",
  		"axxxxx  xxxa",
        "axxxxx  xxxa",
		"axx     xxxa",           
		"axxyyy  xxxa",
		"axxxxx  xxxa",
		"axx     xxxa",
		"axxyyy  xxxa",
		"axxxxx  xxxa",
		"axxxxx  xxxa",
		"axxxxx  xxxa"
	]
);

mapGenerator.addBunch(
	[
		"ayyy       a",
		"axxx      ya",
		"axoob    yxa",
		"axooob  bxxa",	
		"axoooo  oxxa",	
	   	"axxxoo  ooxa",
  		"axxooo  oooa",
        "axoooo  ooxa",
		"aoo     oxxa",           
		"axxybb  xxxa",
		"axxooo  xxxa",
		"axx     oxxa",
		"axxybb  ooxa",
		"axxooo  ooxa",
		"axxxoo  ooxa",
		"axxxxo  ooxa"
	]
);

mapGenerator.addBunch(
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

mapGenerator.addBunch(
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

mapGenerator.addBunch(
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

*/

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