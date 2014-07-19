var gulp = require('gulp');
var complexity = require('gulp-escomplex');
var reporter = require('./index');

var pack = require('./package.json');

gulp.task('complexity', function () {
  return gulp.src([
    'index.js',
    'gulpfile.js'
  ])
  .pipe(complexity({
    packageName: pack.name,
    packageVersion: pack.version
  }))
  .pipe(reporter())
  .pipe(gulp.dest("complexity"));
});
