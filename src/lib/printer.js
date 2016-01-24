// Pretty printer

// libs
var _ = require('lodash');
var pad = require('pad');

module.exports = function print(data, properties) {
  _.each(data, function(d) {
    var values = _.map(properties, function(p) {
      var val = d[p];
      if(_.isNumber(d[p])) {
        val = d[p].toFixed(4);
      }
      var width = Math.ceil(val.length / 5) * 5 + 5;
      return pad(val, width);
    });
    console.log(values.join(''));
  });
};
