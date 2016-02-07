// A dumb trader, can only trade 1 stock

// libs
var _ = require('lodash');
var log = console.log;

// trader defn
module.exports = function Trader(opts) {
  var cash = opts.cash;
  var owned = 0;
  var last = null;

  // public - simulate trading behaviour
  // takes an array of stock data in reverse chronological order
  this.simulate = function(data) {
    _.each(data.reverse(), function(d) {

      // oversold?
      if(d.rsi10 <= 30) {
        var shares = Math.floor(cash * 0.1 / d[opts.on]);
        if(shares > 0) {
          long(d.date, d[opts.on], shares);
        }
      }

      // look for exit
      if(owned > 0 && d.rsi10 >= 70) {
        short(d.date, d[opts.on], owned);
      }

      // for pnl
      last = d;

    });
  };

  // public - returns pnl
  this.pnl = function() {
    var profit = cash + owned * last[opts.on] - opts.cash;
    return {
      cash: cash,
      owned: owned,
      profit: profit,
      percent: profit / opts.cash
    };
  };

  // private - longs a position
  function long(date, price, shares) {
    if(cash >= price * shares) {
      log('%s long %d at %d', date, shares, price);
      cash -= price * shares;
      owned += shares;
    } else {
      log('%s no $ to long %d at %d', date, shares, price);
    }
  }

  // private - shorts a position
  function short(date, price, shares) {
    log('%s short %d at %d', date, shares, price);
    cash += price * shares;
    owned -= shares;
  }
};
