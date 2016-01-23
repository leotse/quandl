// Plugins to enrich the price data
// A plugin is essentially the fn in lodash.map(fn)

// libs
var _ = require('lodash');

// % change plugin
module.exports.change = function(stat, i, stats) {
  if(i + 1 >= stats.length) {
    stat.change = null;
  } else {
    stat.change = (stats[i].close - stats[i + 1].close) /
      stats[i + 1].close;
  }
  return stat;
};

// genric simple moving average plugin
module.exports.sma = function(days) {
  return function(stat, i, stats) {
    var key = 'sma' + days;
    if(i + days >= stats.length) {
      stat[key] = null;
    } else {
      var slice = stats.slice(i, i + days);
      stat[key] = _.sumBy(slice, 'close') / _.size(slice);
    }
    return stat;
  };
};
