// Plugins to enrich the price data
// A plugin is essentially the fn in lodash.map(fn)

// libs
var _ = require('lodash');

// % change
module.exports.change = function(prop) {
  return function(stat, i, stats) {
    if(i + 1 >= stats.length) {
      stat.change = null;
      stat.changepct = null;
    } else {
      stat.change = stats[i][prop] - stats[i + 1][prop];
      stat.changepct = stat.change / stats[i + 1][prop];
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
    return stat;
  };
};

// reltiave strength index (rsi)
module.exports.rsi = function(days, prop) {
  return function(stat, i, stats) {
    if(i + days >= stats.length) {
      stat.rsi = null;
    } else {
      var slice = stats.slice(i, i + days);

      // calculate up/down total
      var updown = _.reduce(slice, function(memo, stat) {
        if(stat.change > 0) {
          memo.up += stat.change;
        } else if(stat.change < 0) {
          memo.down += Math.abs(stat.change);
        }
        return memo;
      }, { up: 0, down: 0});

      // done!
      stat.rsi = 100 - 100 / (1 + updown.up / updown.down);
    }
    return stat;
  };
};
