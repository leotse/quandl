// Test analysis script

// lib
var log = require('lib/log');
var data = require('lib/data');

// start!
log('loading data');
data.load('DOW', onLoaded);

function onLoaded(err, map) {
  if(err) { throw err; }
  log('done!');
  console.log(map.AAPL[0]);
  console.log(map.GS[0]);
  console.log(map.INTC[0]);
}
