var Scoreboard = function() {
  this.el = $("#player-list");
  this.showing = false;
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

Scoreboard.prototype.show = function() {
  if (this.showing === true) {
    return;
  }
  
  this.showing = true;
  
  var canvas = $("#gjs-canvas");
  var w = parseInt(canvas.css('width'), 10)
    , h = parseInt(canvas.css('height'), 10)
    , pos = canvas.position()
    , sbW = w - 40
    , sbH = h - 40
    , sbX = pos.left + Math.floor((w-sbW)/2)
    , sbY = pos.top + Math.floor((h-sbH)/2);
  
  console.log(w, h, pos, sbW, sbH, sbX, sbY);
  
  this.el.css({
    width: sbW,
    height: sbH,
    position: "absolute",
    opacity: 0.8,
    top: sbY + "px",
    left: sbX + "px"
  });
  
  this.el.fadeIn();
};

Scoreboard.prototype.hide = function() {
  if (this.showing === false) {
    return;
  }
  
  this.el.fadeOut();
  this.showing = false;
}

exports.Scoreboard = Scoreboard;