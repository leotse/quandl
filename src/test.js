// Test analysis script
// Dumb script that analyzes 1 stock at a time

// lib
var _ = require('lodash');
var log = require('lib/log');
var data = require('lib/data');
var print = require('lib/printer');
var plugins = require('lib/plugins');

// arg
var TICKER = 'DD';

// start!
log('loading ');
data.load(TICKER, onLoaded);

function onLoaded(err, data) {
  if(err) { throw err; }
  log('data loaded');

  // apply plugins
  _(data[TICKER])
    .map(plugins.change('close'))
    .map(plugins.sma(200, 'close'))
    .map(plugins.delta('close', 'sma200'))
    .value();

  print(data[TICKER].slice(0, 520), [ 'date', 'close', 'change', 'sma200', 'delta' ]);
}
