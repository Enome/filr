var fs = require('fs');
var uuid = require('node-uuid');
var express = require('express');

module.exports = function (settings) {

  var app = express();

  app.get('/', function (req, res) {
    fs.createReadStream(__dirname + '/package.json').pipe(res);
  });

  app.get('/:password/:bundle/:file', function (req, res) {

    var file = settings.dir + '/' + req.params.bundle + '/' + req.params.file;

    fs.exists(file, function (exists) {

      var crs;

      if (exists) {
        crs = fs.createReadStream(file);
      } else {
        crs = fs.createReadStream(settings.default);
      }

      crs.on('error', function (err) {
        console.log(err);
      });

      crs.pipe(res);

    });


  });

  app.post('/:password/:bundle/:filename', function (req, res, next) {

    if (req.params.password !== settings.password) {
      res.status(401);
      return res.send('please use the correct password');
    }

    var bundle_dir = settings.dir + '/' + req.params.bundle;
    var name = uuid.v4();
    var bundle = req.params.bundle;
    var url = req.header('host') + '/' + bundle + '/' + name;

    req.pipe(fs.createWriteStream(bundle_dir + '/' + name));

    req.on('end', function () {

      console.log('create file: ' + req.params.filename + ' => ' + bundle + '/' + name);

      res.json({ name: name, bundle: bundle, url: url });

    });
            
  });

  return app;

};
