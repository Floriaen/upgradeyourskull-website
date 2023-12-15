/////////////////////////////////////
// Be carefull, this is a dirty code.
// Read it at your own risk
// ©floriaen 2012
//////////////////////////////////

var Ajax={
	POST	: "POST",
	GET		: "GET",
	getHTTPRequest:function() {
		var http;
		if ( window.XMLHttpRequest ) {
			http = new XMLHttpRequest();
		} else if ( window.ActiveXObject ) {
			http = new ActiveXObject("Microsoft.XMLHTTP");
		}
		return http;
	},
	request: function( method, async, url, params, onsuccess, onerror ) {
		
		var ax=Ajax.getHTTPRequest();		
		// METHOD
		if( method == Ajax.GET ) {
			ax.open( Ajax.GET, url += "?" + params, async );
		} else {
			ax.open( Ajax.POST, url, async );
			ax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			ax.setRequestHeader("Content-length", params.length);
			ax.setRequestHeader("Connection", "close");
		}
		
		// SYNCHRO
		if (async == true) 
		{		
			ax.onreadystatechange = function(){
				if (ax.readyState == 4 ) {
					if (ax.status == 200) {
						if (onsuccess) {
							onsuccess.call(ax);
						}
					} else {
						if (onerror) {
							onerror.call(ax);
						}
					}
				}
			};
			// send
			if( method == Ajax.GET ) ax.send(null);
			else ax.send(params); 	
		} else {
			// send
			if( method == Ajax.GET ) ax.send(null);
			else ax.send(params);
			if (onsuccess) {
				onsuccess.call(ax);
			}
		}
	}
};