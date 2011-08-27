var socket = io.connect();
socket.on('ack', function(data) {
  console.log('received', data);
});