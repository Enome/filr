var fs = require('fs');
var uuid = require('node-uuid');
var express = require('express');

module.exports = function (settings) {

  var app = express();

  app.get('/:password/:bundle/:file', function (req, res) {

    var crs = fs.createReadStream(settings.dir + '/' + req.params.bundle + '/' + req.params.file);
    crs.pipe(res);

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

      res.json({
        name: name,
        bundle: bundle,
        url: url
      });
    });
            
  });

  return app;

};
