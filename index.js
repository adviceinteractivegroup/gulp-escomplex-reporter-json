var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');

var json = require('./lib/json');
var pack = require('./package.json');

var PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-escomplex-reporter-json';

function gulpESComplexReporterJSON ( ) {
  // reporting information
  var data = { };
  data.reports = [ ];

  // Creating a stream through which each file will pass
  var stream = through.obj(function(file, enc, callback) {
    if (file.isStream()) {
      return callback(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    if (!file.isNull() && file.analysis) {
      try {
        var analysis = JSON.parse(file.analysis.toString('utf8'));

        var newFile = file.clone();

        newFile.contents = new Buffer(json.render(null, analysis));
        newFile.path = file.path + ".json";
        newFile.path = newFile.path.replace(/\\/g, '/');
        newFile.cwd = newFile.cwd.replace(/\\/g, '/');
        
        data.reports.push(newFile.path.split(newFile.cwd + path.sep)[1]);

        if (!data.baseDir) {
          data.baseDir = file.base.replace(/\\/g, '/');
          data.cwd = file.cwd.replace(/\\/g, '/');
          data.reporterName = pack.name;
          data.reporterVersion = pack.version;
          if (analysis.meta) {
            if (analysis.meta.packageName) {
              data.packageName = analysis.meta.packageName;
            }

            if (analysis.meta.packageVersion) {
              data.packageVersion = analysis.meta.packageVersion;
            }

            if (analysis.meta.analysis) {
              data.analysis = analysis.meta.analysis;
            }

            if (analysis.meta.analysisVersion) {
              data.analysisVersion = analysis.meta.analysisVersion;
            }
          }
        }

        this.push(newFile);
      } catch (err) {
        return callback(new PluginError(PLUGIN_NAME, 'Unable to decode escomplex analysis'));
      }
    }

    callback();
  }, function (callback) {
    data.created = new Date().toISOString();
    var indexFile = new gutil.File({
      cwd: data.cwd,
      base: data.baseDir,
      path: data.baseDir + "/index.json",
      contents: new Buffer(json.render(null, data))
    });

    this.push(indexFile);
    callback();
  });

  // returning the file stream
  return stream;
}

// Exporting the plugin main function
module.exports = gulpESComplexReporterJSON;
