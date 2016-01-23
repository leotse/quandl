// Test analysis script

// lib
var _ = require('lodash');
var log = require('lib/log');
var data = require('lib/data');
var plugins = require('lib/plugins');

// start!
log('loading data');
data.load('INTC', onLoaded);

function onLoaded(err, data) {
  if(err) { throw err; }
  log('data loaded');
  _(data.INTC)
    .map(plugins.change)
    .map(plugins.sma(50))
    .map(plugins.sma(100))
    .map(plugins.sma(200))
    .value();

  print(data.INTC.slice(0, 30), [ 'close', 'change', 'sma50', 'sma100', 'sma200' ]);
}

// helper - pretty prints the given list of properties
function print(data, properties) {
  _.each(data, function(d) {
    var parts = [ d.date ];
    var values = _.map(properties, function(p) {
      if(_.isNumber(d[p])) {
        return d[p].toFixed(4);
      }
      return d[p];
    });
    parts = parts.concat(values);
    console.log(parts.join('\t'));
  });
}
