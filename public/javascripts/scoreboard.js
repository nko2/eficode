var Scoreboard = function() {
  this.el = $("#player-list");
};

Scoreboard.prototype.removePanda = function(pandaId) {
  this.el.find("#panda-" + pandaId).remove();
};

Scoreboard.prototype.addPanda = function(pandaId, nick, initialScore) {
  if (initialScore === undefined) {
    initialScore = 0;
  }
  
  var row = $("<li>").attr('id', 'panda-' + pandaId).attr('data-score', initialScore);
  var nick = $("<div>").addClass('nick').text(nick);
  var score = $("<div>").addClass('score').text(initialScore);
  
  row.append(nick);
  row.append(score);
  
  var pandaItems = $(this.el).find("li").get();
  var appendBefore = _.detect(pandaItems, function(item) {
    var score = parseInt($(item).attr('data-score'), 10);
    
    if (score <= initialScore) {
      return true;
    } else {
      return false;
    }
  });
  
  if (appendBefore) {
    $(appendBefore).before(row);
  } else {
    this.el.append(row);
  }
};

Scoreboard.prototype.updateScore = function(pandaId, newScore) {
  var nick = this.el.find("#panda-" + pandaId).find(".nick").text();
  this.removePanda(pandaId);
  this.addPanda(pandaId, nick, newScore);
};

exports.Scoreboard = Scoreboard;