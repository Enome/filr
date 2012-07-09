var fs = require('fs');
var http = require('http');
var express = require('express');
var uuid = require('node-uuid');
var settings = require('./settings');

var app = express();

app.get('/:bundle/:file', function (req, res) {

  var crs = fs.createReadStream(settings.base_dir + '/' + req.params.bundle + '/' + req.params.file);
  crs.pipe(res);

});

app.post('/:password/:bundle', function (req, res, next) {

  if (req.params.password !== settings.password) {
    res.status(401);
    return res.send('Please use the correct password');
  }

  var bundle_dir = settings.base_dir + '/' + req.params.bundle;
  var name = uuid.v4();
  var bundle = req.params.bundle;
  var url = req.header('host') + '/' + bundle + '/' + name;

  req.pipe(fs.createWriteStream(bundle_dir + '/' + name));

  req.on('end', function () {
    res.json({
      name: name,
      bundle: bundle,
      url: url
    });
  });
          

});

module.exports = app;
