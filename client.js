var fs = require('fs');
var request = require('request');

module.exports = function (settings) {


  var url = 'http://' + settings.url + '/' + settings.password + '/' + settings.bundle;

  return {

    post: function (path, callback) {
      var filename = path.replace(/.*\//, '');
      fs.createReadStream(path).pipe(request.post(url + '/' + filename, function (err, resp, body) {

        if (err) { return callback(err); }
        callback(null, JSON.parse(body));

      }));
    },

    get: function (name, callback) {

      request.get(url + '/' + name, function (err, resp, body) {

        if (err) { return callback(err); }
        callback(null, body);

      });
    }

  };

};
