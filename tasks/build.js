var gulp = require('gulp')
var loadPlugins = require('gulp-load-plugins')

var config = require('../config').build

/** WordPress データを構築する */
gulp.task('build:wordpress', () => {
  var $ = loadPlugins()

  return gulp.src(config.wordpress.source)
    .pipe($.newer(config.dest))
    .pipe(gulp.dest(config.dest))
    .pipe($.size({ title: 'build:wordpress' }))
    .pipe($.preservetime())
});
