/////////////////////////////////////
// Be carefull, this is a dirty code.
// Read it at your own risk
// ©floriaen 2012
//////////////////////////////////

function SocialNetworking() {
	
};
SocialNetworking.prototype.share = function(socialNetwork, text, url) {
	var shareUrl = null;
	switch (socialNetwork) {
		case SocialNetwork.FACEBOOK:
			var param = "t=" + encodeURIComponent(text) + "&u=" + encodeURIComponent(url);
			shareUrl = "http://www.facebook.com/sharer.php" + "?" + param;
		break;
		
		case SocialNetwork.TWITTER:
			var param = "text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(url);
			shareUrl = "https://twitter.com/share" + "?" + param;
		break;
		
		default:
			throw "No social network found for " + socialNetwork;
		break;
	}

	window.open(shareUrl);
};

// Singleton:
SocialNetworking.getInstance = function() {
	if (!SocialNetworking.hasOwnProperty("__instance")) {
		SocialNetworking.__instance = new SocialNetworking();
	}
	return SocialNetworking.__instance;
};

// const:
var SocialNetwork = {
	FACEBOOK: "facebook",
	TWITTER: "twitter"
};