// Timestamped logger

module.exports = function() {
  var args = Array.prototype.slice.call(arguments);
  args[0] = '[' + (new Date()).toISOString() + '] ' + args[0];
  console.log.apply(console, args);
};
