var cnt = 0;

// Good enough for our purposes?
module.exports = function() {
  cnt += 1;
  return cnt + "_" + Math.ceil(Math.random() * 1000);
}
