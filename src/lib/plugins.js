// Plugins to enrich the price data
// A plugin is essentially the fn in lodash.map(fn)

// libs
var _ = require('lodash');

// % change
module.exports.change = function(prop) {
  return function(stat, i, stats) {
    if(i + 1 >= stats.length) {
      stat.change = null;
    } else {
      stat.change = (stats[i][prop] - stats[i + 1][prop]) /
        stats[i + 1][prop];
    }
    return stat;
  };
};

// simple moving average plugin
module.exports.sma = function(days, prop) {
  return function(stat, i, stats) {
    var key = 'sma' + days;
    if(i + days >= stats.length) {
      stat[key] = null;
    } else {
      var slice = stats.slice(i, i + days);
      stat[key] = _.sumBy(slice, prop) / _.size(slice);
    }
    return stat;
  };
};

// delta
module.exports.delta = function(prop1, prop2) {
  return function(stat, i, stats) {
    stat.delta = (stat[prop1] - stat[prop2]) / stat[prop1];
  };
};
