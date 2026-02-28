var logger = new (
	Class.create({
		initialize: function() {
			
		},
		trace: function() {
			var m = '';
			for (var i in arguments) {
				m += arguments[i] + ' ';
			}
			$('logger').update(m);
		}
	})
);