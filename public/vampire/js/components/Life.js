/**@
* @trigger LifeMinReached 
* @trigger LifeMaxReached
*
*/

// support only 2D style!
Crafty.c("Life", {
	
	_lifeGap: 0,
	_lifeMin: 0,
	_lifeMax: 0,
	_life: 0,
	_initialYPos: 0,

	life: function(min, max, gap, current) {
		current = current || max;
		this.requires("2D, DOM");

		// progress bar
		var progress = document.createElement("div");
		progress.style.backgroundColor = "red";
		progress.style.height = this.h + "px";
		this._element.appendChild(progress);


		this._lifeMin = min;
		this._lifeMax = max;
		this._lifeGap = gap;

		//this._life = (current > this._lifeMax) ? this._lifeMax: ((current < this._lifeMin) ? this._lifeMin: current);
		this._setLife(current);

		var ratio = this.w / this._lifeMax;
		var draw = function(e) {
			if (e.type === "canvas") {
				// Hook
			} else if (e.type === "DOM") {
				progress.style.width = ~~(this._life * ratio) + "px";
			}
		};


		this._initialYPos = this._y;
		this._initialXPos = this._x;
		// var updatePosition = function(e) {
		// 	console.log(e);
		// 	this._y = this._initialYPos - Crafty.viewport.y;
		// };

		this.bind("Draw", draw).bind("RemoveComponent", function (id) {
			if (id === "Life") this.unbind("Draw", draw);
		});

		// this.bind("EnterFrame", updatePosition).bind("RemoveComponent", function (id) {
		// 	if (id === "Life") this.unbind("EnterFrame", updatePosition);
		// });


		return this;
	},

	_setLife: function(value) {
		if (value != this._life) {
			value = (value > this._lifeMax) ? this._lifeMax: ((value < this._lifeMin) ? this._lifeMin: value);
			if (value != this._life) { // still different
				this._life = value;
				this.trigger("Change");
				if (this._life === this._lifeMin) {
					this.trigger("LifeMinReached");
				} else
				if (this._life === this._lifeMax) {
					this.trigger("LifeMaxReached");
				}
			}
		}
	},

	isEmpty: function() {
		return (this._life == 0);
	},

	decreaseLife: function() {
		this._setLife(this._life - this._lifeGap);
	},
	increaseLife: function() {
		this._setLife(this._life + this._lifeGap);
	},
	emptyLife: function() {
		this._setLife(this._lifeMin);
	},
	fillLife: function() {
		this._setLife(this._lifeMax);
	}
});