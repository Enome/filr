var fs = require('fs');
var http = require('http');
var rimraf = require('rimraf');
var request = require('request');

var app = require('./app');
var client = require('./client');

var base = __dirname + '/output';
var server = http.createServer(app({dir: base, default: __dirname + '/default.txt', password: '1234'}));

describe('Filr', function () {

  before(function (done) {
    
    rimraf.sync(base);
    fs.mkdirSync(base);
    fs.mkdirSync(base + '/test');
    server.listen(9999, function () {
      done();
    });

  });

  it('creates the file then requests it again', function (done) {

    var c = client({ url: '0.0.0.0:9999', bundle: 'test', password: '1234' });

    c.post(__dirname + '/file.txt', 'file.txt', function (err, resp, body) {

      c.get(resp.name, function (err, resp) {

        resp.should.eql('Beep Beep this is a test.\n');
        done();

      });

    });

  });


  it('uses default is file doesnt exist', function (done) {

    var c = client({ url: '0.0.0.0:9999',  bundle: 'test', password: '1234' });

    c.post(__dirname + '/file.txt', 'file.txt', function (err, resp, body) {

      c.get('undefined', function (err, resp) {

        resp.should.eql('default text\n');
        done();

      });

    });

  });


});
