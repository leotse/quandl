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

// simple moving average(sma)
module.exports.sma = function(days, prop) {
  return function(stat, i, stats) {
    var key = 'sma_' + days;
    if(i + days >= stats.length) {
      stat[key] = null;
    } else {
      var slice = stats.slice(i, i + days);
      stat[key] = _.sumBy(slice, prop) / _.size(slice);
    }
    return stat;
  };
};

// exponential moving average(ema)
module.exports.ema = function(days, prop) {
  var alpha = 2 / (days + 1);
  var key = 'ema_' + days;

  // calculate when the weight becomes negligible
  var c = getPow(1 - alpha, 1e-6);

  return function(stat, i, stats) {
    if(i + c >= stats.length) {
      stat[key] = null;
    } else {
      var slice = stats.slice(i, i + c);
      stat[key] = _(slice).map(function(stat, power) {
        return stat[prop] * Math.pow(1 - alpha, power);
      }).sum() * alpha;
    }
    return stat;
  };
};

// delta
module.exports.delta = function(prop1, prop2, name) {
  return function(stat, i, stats) {
    stat[name] = stat[prop1] - stat[prop2];
    return stat;
  };
};

// delta %
module.exports.deltapct = function(prop1, prop2, name) {
  return function(stat, i, stats) {
    stat[name] = (stat[prop1] - stat[prop2]) / stat[prop1];
    return stat;
  };
};

// reltiave strength index (rsi)
module.exports.rsi = function(days, prop) {
  var key = 'rsi' + days;
  return function(stat, i, stats) {
    if(i + days >= stats.length) {
      stat[key] = null;
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
      stat[key] = 100 - 100 / (1 + updown.up / updown.down);
    }
    return stat;
  };
};

// weighted relative strength index
// similar to simple rsi, but weighted by trading volume
module.exports.w_rsi = function(days, changeprop, volprop) {
  var key = 'w_rsi_' + days;
  return function(stat, i, stats) {
    if(i + days >= stats.length) {
      stat[key] = null;
    } else {
      var slice = stats.slice(i, i + days);

      // total volume to be used for weights
      var totalVolume = _.sumBy(slice, volprop);

      // calculate weighted up/down
      var updown = _.reduce(slice, function(memo, stat) {
        if(stat[changeprop] > 0) {
          memo.up += stat[changeprop] * stat[volprop] / totalVolume;
        } else if(stat[changeprop] < 0) {
          memo.down += Math.abs(stat[changeprop] * stat[volprop] / totalVolume);
        }
        return memo;
      }, { up: 0, down: 0 });

      // map rsi to [1-100]
      stat[key] = 100 - 100 / (1 + updown.up / updown.down);
    }
    return stat;
  };
};

// helper - calculates n when Math.pow(alpha, n) < epsilon
// alpha must < 1 obvisouly
function getPow(alpha, epsilon) {
  var pow = 0;
  var weight = alpha;
  while(weight > epsilon) {
    weight = Math.pow(alpha, ++pow);
  }
  return pow;
}
