var fs = require('fs');
var http = require('http');
var rimraf = require('rimraf');
var request = require('request');
var app = require('./app.js');
var server = http.createServer(app);
var settings = require('./settings');

var base = __dirname + '/output';
settings.base_dir = base;
settings.password = '1234';

describe('Lemon', function () {

  before(function (done) {
    
    rimraf.sync(base);
    fs.mkdirSync(base);
    fs.mkdirSync(base + '/test');
    server.listen(9999, function () {
      done();
    });

  });

  it('creates the file then requests it again', function (done) {

    var crs = fs.createReadStream(__dirname + '/file.txt');
    var r = request.post('http://0.0.0.0:9999/1234/test', function (err, res, body) {
      request.get('http://' + JSON.parse(body).url, function (err, res, body) {
        body.should.eql('Beep Beep this is a test.\n');
        done();
      });
    });

    crs.pipe(r);

  });

});
