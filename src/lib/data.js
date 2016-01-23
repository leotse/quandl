// Load stock data into memory

// lib
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var async = require('async');

var log = require('lib/log');
var lookup = require('lib/lookup');

// public - load a single ticker or an index of tickers
module.exports.load = function(symbol, callback) {

  // if symbol is an index, load all tickers in the index
  // otherwise just load the ticker's data
  if(!lookup[symbol]) {
    loadTicker(symbol, callback);
  } else {
    loadIndex(symbol, callback);
  }
};

// private - loads all tickers from an index
function loadIndex(symbol, callback) {
  var tickers = lookup[symbol];
  async.mapSeries(tickers, loadTicker, function(err, results) {
    if(err) { return callback(err); }
    var map = {};
    for(var i = 0; i < results.length; i++) {
      map = _.extend(map, results[i]);
    }
    callback(null, map);
  });
}

// private - loads data for a single ticker
function loadTicker(ticker, callback) {
  var file = path.join(__dirname, '../../data/', ticker + '.csv');
  fs.readFile(file, 'utf8', function(err, content) {
    if(err) { return callback(err); }
    var map = {};
    map[ticker] = parse(content);
    callback(null, map);
  });
}

// private - parses a stock data csv
function parse(content) {

  // split content by lines
  // and ignore header and EOF newline
  var lines = content.trim().split('\n').slice(1);

  // and parse each line
  return _(lines).map(function(line, i) {
    var parts = line.split(',');

    // ignore invalid entries
    // will be filtered out by the next stage in the pipeline
    if(parts.length !== 13) {
      log('invalid line', line);
      return null;
    }

    // parse the csv line
    return {
      date: parts[0],
      open: Number(parts[1]),
      high: Number(parts[2]),
      low: Number(parts[3]),
      close: Number(parts[4]),
      volume: Number(parts[5]),
      ex_dividend: Number(parts[6]),
      split_ratio: Number(parts[7]),
      adj: {
        open: Number(parts[8]),
        high: Number(parts[9]),
        low: Number(parts[10]),
        close: Number(parts[11]),
        volume: Number(parts[12])
      }
    };
  })
  .without(null)
  .value();
}
