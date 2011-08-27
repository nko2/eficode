var Socket = function() {
	this.socket = io.connect();
};

Socket.prototype.join = function(nick, callback) {
	this.socket.emit('join', nick, callback);
};

module.exports.Socket = Socket;