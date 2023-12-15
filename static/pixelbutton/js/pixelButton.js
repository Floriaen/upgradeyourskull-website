/*
	This program is free software; you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation; version 2 of the License.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.
*/
$.fn.textSize = function(){
	var sensor = $('<div />').css({margin: 0, padding: 0});
	$(this).append(sensor);
	var size = {
		width: sensor.width(),
		height: sensor.innerHeight()
	};
	//sensor.remove();
	return size;
};

// TODO text size <=> element size ?

(function() {
	function _Button() {
		this.$c = null;
	};
	_Button.prototype = {
		click: function(handler) {
			var _s = this;
			this.$c.bind("click", function(e) {
				if (handler) {
					handler.call(_s);
				}
			});
			return _s;
		},
		convert: function(id, map) {
			var _s = this;
			var $b = $(id);
			if ($b.length > 0) {
				var mapObject = new Map(map);
				var pixel = mapObject.getPixel($b.width(), $b.height());
				_s.$c = mapObject.asciiMapToElement(pixel);

				_s.$c.width("100%");
				_s.$c.height("100%");
			
				$b.bind("mouseenter", function(e) {
					$("#text").css("color", "white");
					switchPixelColor();
				});
				$b.bind("mouseleave", function(e) {
					$("#text").css("color", "black");
					switchPixelColor();
				});
				$b.empty().css({border: "none"}).append(_s.$c);
			} else {
				throw id + " html element not found";
			}	
			return _s;
		},

		text: function(value) {
			var _s = this;

			var $outerText = $('<div/ >');
			$outerText.attr("id", "text");
			$outerText.css({
				position: "absolute",
				textAlign: "center"
			});
			
			$innerText = $('<span>' + value + '</span>');
			$innerText.css({
				fontFamily: "Arial",
				fontWeight: "bold",
				fontSize: "80%",
				textAlign: "center"
			});
			_s.$c.append($outerText.append($innerText));

			var left = (_s.$c.width() - $outerText.width())/2;
			var top = (_s.$c.height() - $outerText.height())/2;

			$outerText.css("left", left + "px");
			$outerText.css("top", top + "px");
			
			return _s;
		}				
	};
	
	function switchPixelColor() {
		var $black = $(".pixel-black");
		var $white = $(".pixel-white");
		
		$black.each(function() {
			$(this).removeClass("pixel-black").addClass("pixel-white");
			$(this).css("background-color", "white");
		});
		$white.each(function() {
			$(this).removeClass("pixel-white").addClass("pixel-black");
			$(this).css("background-color", "black");
		});
	};
	
	function Map(map) {
		this.map = map;
	};
	Map.prototype = {
		getPixel: function(containerWidth, containerHeight) {
			var mh = this.map.length;
			var mw = this.map[0].length;
			return {
				width: Math.ceil(containerWidth/mw),
				height: Math.ceil(containerHeight/mh),
			};
		},
	
		/*
			pixel {
				width:0,
				height:0
			}
	
		*/
		asciiMapToElement: function(pixel) {
			// TODO ensure valid map, same length for each lines
			var l = this.map[0].length;
			var $content = $('<div />');
			$content.css("position", "relative");
			for (var i = 0; i < this.map.length; i++) {
				// new line
				var $line = $('<div />').css("overflow", "auto");
				for (var j = 0; j < l ; j++) {
					var $cell = $('<div />').css({
						display: "table-cell",
						width: pixel.width + 'px',
						height: pixel.height + 'px'
					});
					// color, TODO move to a method:
					if (this.map[i][j] == 'x') {
						$cell.addClass("pixel-black").css("backgroundColor", "black");
					} else {
						$cell.addClass("pixel-white").css("backgroundColor", "white");
					}
					$line.append($cell);
				}
			
				$content.append($line);
			}
			return $content;
		}
	}
	
	window.PixelButton = new _Button();
})();