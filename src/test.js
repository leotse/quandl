// Test analysis script
// Dumb script that analyzes 1 stock at a time

// lib
var _ = require('lodash');
var log = require('lib/log');
var data = require('lib/data');
var plugins = require('lib/plugins');
var Trader = require('lib/trader');

var print = require('lib/printer');

// arg
var TICKER = 'MSFT';

// start!
log('loading ');
data.load(TICKER, onLoaded);

function onLoaded(err, data) {
  if(err) { throw err; }
  log('data loaded');

  // add technicals
  _(data[TICKER])
    .map(plugins.change('adj_close'))
    .map(plugins.sma(50, 'adj_close'))
    .map(plugins.ema(50, 'adj_close'))
    .map(plugins.w_rsi(10, 'change', 'adj_volume'))
    .value();

  log('done!');

  // print(data[TICKER].slice(0, 252*1), [
  //   'date',
  //   'adj_open',
  //   'adj_close',
  //   'adj_high',
  //   'adj_low',
  //   'adj_volume',
  //   'change',
  //   'changepct',
  //   'w_rsi_10'
  // ]);

  // feed data to trader
  var trader = new Trader({ on: 'adj_close', cash: 10000 });
  trader.simulate(data[TICKER].slice(0, 252 * 5));
  console.log(trader.pnl());
}
