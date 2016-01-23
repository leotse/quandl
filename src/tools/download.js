// Downloads data for all specified tickers
// Also supports index wide downloads

// libs
var async = require('async');
var parse = require('minimist');

var dl = require('./downloader');
var lookup = require('lib/lookup');
var log = require('lib/log');

// parse command line args
var argv = parse(process.argv.slice(2));
var ticker = argv.t;
var index = argv.i;
if(!ticker && !index) {
  usage();
  process.exit();
}

// lookup tickers of an index if neccessary
var tickers;
if(ticker) { tickers = [ ticker ]; }
else { tickers = lookup[index]; }

// download data!
async.mapLimit(tickers, 1, dlTicker, onComplete);

function dlTicker(ticker, done) {
  dl(ticker, done);
}

function onComplete(err) {
  if(err) { throw err; }
  log('stocks data downloaded!');
  process.exit();
}

// helper - displays command usage
function usage() {
  console.log('usage: download -t ticker OR download -i index');
}
