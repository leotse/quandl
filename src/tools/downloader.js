// Downloads historic stock data from Quandl WIKI free db

// libs
var fs = require('fs');
var path = require('path');
var util = require('util');
var request = require('request');

var config = require('config');
var log = require('lib/log');

// constants
var URL = 'https://www.quandl.com/api/v3/datasets/WIKI/%s.csv?auth_token=%s';

// public - downloads a file
var download = module.exports = function (ticker, callback) {
  log('downloading', ticker);

  var url = util.format(URL, ticker, config.QUANDL_TOKEN);
  var outFile = path.join(__dirname, '../../data', ticker.toUpperCase() + '.csv');
  var out = fs.createWriteStream(outFile);

  var stream = request.get(url);
  if(callback) {
    stream.on('end', callback);
    stream.on('error', callback);
  }
  stream.pipe(out);
};
