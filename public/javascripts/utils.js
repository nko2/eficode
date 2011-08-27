var gamejs = require("gamejs")
  , evts   = gamejs.event
  , params = window.params;
	

exports.keyToDirection = function(key) {
  switch (key) {
		case evts.K_UP:
			return params.Direction.UP;
			
		case evts.K_DOWN:
			return params.Direction.DOWN;
			
		case evts.K_LEFT:
			return params.Direction.LEFT;
			
		case evts.K_RIGHT:
			return params.Direction.RIGHT;
			
		default:
			return -1;
	}
};