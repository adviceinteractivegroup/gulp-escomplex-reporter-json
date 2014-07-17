var gulp = require('gulp');
var complexity = require('gulp-escomplex');
var reporter = require('./index');

gulp.task('complexity', function () {
  return gulp.src([
    'index.js',
    'gulpfile.js'
  ])
  .pipe(complexity())
  .pipe(reporter())
  .pipe(gulp.dest("complexity"));
});
