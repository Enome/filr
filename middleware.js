var fs = require('fs');
var uuid = require('node-uuid');

module.exports = function (app, dir, password) {

  app.get('/', function (req, res) {
    res.send('Beep Beep lemon is running');
  });

  app.get('/:password/:bundle/:file', function (req, res) {

    var crs = fs.createReadStream(dir + '/' + req.params.bundle + '/' + req.params.file);
    crs.pipe(res);

  });

  app.post('/:password/:bundle/:filename', function (req, res, next) {

    if (req.params.password !== password) {
      res.status(401);
      return res.send('Please use the correct password');
    }

    var bundle_dir = dir + '/' + req.params.bundle;
    var name = uuid.v4();
    var bundle = req.params.bundle;
    var url = req.header('host') + '/' + bundle + '/' + name;

    req.pipe(fs.createWriteStream(bundle_dir + '/' + name));

    req.on('end', function () {

      console.log('Create file: ' + req.params.filename + ' => ' + bundle + '/' + name);

      res.json({
        name: name,
        bundle: bundle,
        url: url
      });
    });
            
  });

};
