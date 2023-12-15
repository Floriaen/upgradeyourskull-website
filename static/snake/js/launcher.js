/////////////////////////////////////
// Be carefull, this is a dirty code.
// Read it at your own risk
// ©floriaen 2012
//////////////////////////////////

function launch() {
	var v = 4;
	head.js(
		"js/utils/Ajax.js#" + v,
		"js/utils/SocialNetworking.js#" + v,
		"js/service/StatisticsSender.js#" + v,
		
		"resources/data/items.json#" + v,
		
		"js/utils/Array.js#" + v,
		"js/lib/crafty.js#" + v,
		"js/lib/PathFinding.min.js#" + v,
		"js/component/common/Moveable.js#" + v,
		"js/component/common/Score.js#" + v,
		"js/component/common/SpriteMask.js#" + v, // currently override the Crafty Sprite component
		"js/component/Worm.js#" + v,
		"js/service/ItemGenerator.js#" + v,
		"js/service/FoodGenerator.js#" + v,

		// capture
		"js/lib/canvas-capture.js#" + v,
		"js/utils/Capture.js#" + v,
		"js/lib/stats.js#" + v,

		"js/game.js#" + v,

		function() {
			
			var debugMode = false;
			if (debugMode) { 
				
				var debugTools = document.createElement("debugTools");
				
				// Capture
				var captureBtn = document.createElement("input");
				captureBtn.type = "button";
				captureBtn.value = "capture";
				captureBtn.onclick = function() {
					Capture.toogle();
					if (Capture.started == true) {
						this.value = "Stop";
					} else {
						window.open(Capture.cc.getImageURL(), '_blank');
						this.value = "Capture";
					}
				};
				debugTools.appendChild(captureBtn);
			
				// FPS:
				var stats = new Stats();

				// Align top-left
				stats.getDomElement().style.position = 'absolute';
				stats.getDomElement().style.left = '0px';
				stats.getDomElement().style.top = '0px';

				debugTools.appendChild( stats.getDomElement() );

				document.body.appendChild(debugTools);
			
				setInterval( function () {
					stats.update();
				}, 1000 / Crafty.timer.getFPS() );
			}
			
			// Toolbar:
			if (document.getElementById("facebook-button")) {
				document.getElementById("facebook-button").onclick = function() {
					var text = "I didn't play that game, but hey! Check it out.";
					if (maxItemFound > 0) {
						text = "WOW! I found " + maxItemFound + " items";
					}
					SocialNetworking.getInstance().share(SocialNetwork.FACEBOOK, text, "http://floriaen.fr/snake");
				};
				document.getElementById("twitter-button").onclick = function() {
					var text = "I didn't play that game, but hey! Check it out.";
					if (maxItemFound > 0) {
						text = "WOW! I found " + maxItemFound + " items";
					}
					SocialNetworking.getInstance().share(SocialNetwork.TWITTER, text, "http://floriaen.fr/snake");
				};	
			}
			
			
			// Fullscreen management:
			var fullscreen = false;

			var fullscreenButton = document.getElementById("fullscreen-button");
		    if (fullscreenButton) {
		        fullscreenButton.addEventListener("click", function () {
					if (fullscreen) {
						if (document.exitFullscreen) {
			                document.exitFullscreen();
			            }
			            else if (document.mozCancelFullScreen) {
			                document.mozCancelFullScreen();
			            }
			            else if (document.webkitCancelFullScreen) {
			                document.webkitCancelFullScreen();
			            }
					} else {
						var docElm = document.documentElement;
			            if (docElm.requestFullscreen) {
			                docElm.requestFullscreen();
			            }
			            else if (docElm.mozRequestFullScreen) {
			                docElm.mozRequestFullScreen();
			            }
			            else if (docElm.webkitRequestFullScreen) {
			                docElm.webkitRequestFullScreen();
			            }
					}

		        }, false);
		    }

			var fullscreenChangeHandler = function () {
	            fullscreen = !fullscreen;
				if (fullscreen) {
					document.getElementById("container").style.margin = "100px auto";
					fullscreenButton.className += "button fullscreen";
				} else {
					document.getElementById("container").style.margin = "20px auto";
					fullscreenButton.className += "button fullscreen";
				}
	        };

			document.addEventListener("fullscreenchange", fullscreenChangeHandler, false);
			document.addEventListener("mozfullscreenchange", fullscreenChangeHandler, false);
			document.addEventListener("webkitfullscreenchange", fullscreenChangeHandler, false);

			loadGame();
			//Crafty.modules('http://cdn.craftycomponents.com/', { HitBox: 'release' }, function() {loadGame()});
		}
	);
};