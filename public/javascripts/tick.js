var gamejs = require('gamejs');

var start = function(display) {	
	var tick = function() {
		console.log("hello world");
	};
	
	gamejs.time.fpsCallback(tick, this, 26);
};

exports.start = start;