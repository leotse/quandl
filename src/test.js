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
    .map(plugins.sma(200, 'adj_close'))
    .map(plugins.delta('adj_close', 'sma200'))
    .map(plugins.rsi(10, 'change'))
    .value();

  // print.pretty(data[TICKER].slice(0, 252), [ 'date', 'adj_close', 'change', 'sma200', 'delta' ]);
  print(data[TICKER].slice(0, 20), [ 'date', 'adj_close', 'change', 'sma200', 'rsi' ]);

  // feed data to trader
  // var trader = new Trader({ on: 'adj_close', cash: 10000 });
  // trader.simulate(data[TICKER].slice(0, 252 * 3));
  // console.log(trader.pnl());
}
