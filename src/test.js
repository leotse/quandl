// Test analysis script
// Dumb script that analyzes 1 stock at a time

// lib
var _ = require('lodash');
var log = require('lib/log');
var data = require('lib/data');
var print = require('lib/printer');
var plugins = require('lib/plugins');
var Trader = require('lib/trader');

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
    .map(plugins.sma(200, 'adj_close'))
    .map(plugins.delta('adj_close', 'sma200'))
    .value();

  // print(data[TICKER].slice(0, 504), [ 'date', 'close', 'change', 'sma200', 'delta' ]);

  // feed data to trader
  var trader = new Trader({ on: 'adj_close', cash: 10000 });
  trader.simulate(data[TICKER].slice(0, 252 * 3));
  console.log(trader.pnl());
}
