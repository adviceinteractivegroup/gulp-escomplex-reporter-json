var through = require('through2');
var gutil = require('gulp-util');

var json = require('./lib/json');

var PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-escomplex-reporter-json';

function gulpESComplexReporterJSON ( ) {
  // Creating a stream through which each file will pass
  var stream = through.obj(function(file, enc, callback) {
    if (file.isStream()) {
      return callback(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    if (!file.isNull() && file.analysis) {
      try {
        var analysis = JSON.parse(file.analysis.toString('utf8'));

        var newFile = new gutil.File({
          cwd: file.cwd,
          base: file.base,
          path: file.path + ".json",
          contents: new Buffer(json.render(null, analysis))
        });

        this.push(newFile);
      } catch (err) {
        return callback(new PluginError(PLUGIN_NAME, 'Unable to decode escomplex analysis'));
      }
    }

    callback();
  });

  // returning the file stream
  return stream;
}

// Exporting the plugin main function
module.exports = gulpESComplexReporterJSON;
