var count = process.argv[2];
var name = process.argv[3];
var export = process.argv[4];
var tuples = [];
var _ = require('./public/javascripts/underscore-min.js')._;
var params = require('./public/javascripts/params.js');
var util = require('util');
_(_.range(count)).each(function() {
    var x, y;
    x = Math.random() * params.gameWidth;
    y = Math.random() * params.gameHeight;
    tuples.push([Math.floor(x),Math.floor(y)]);
});
console.log("var " + name + " = " + util.inspect(tuples) + ";");
if(export) {
    console.log("exports = " + name + ";");
}
