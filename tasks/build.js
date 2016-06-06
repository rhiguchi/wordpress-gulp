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

/** テーマファイルを最小化 */
gulp.task('build:theme', ['theme'], () => {
  var $ = loadPlugins()

  uglify = $.uglify({ preserveComments: 'some' }).on('error', $.util.log)

  return gulp.src(config.theme.source)
    .pipe($.if('**/*.js', uglify))
    .pipe($.if('**/*.css', $.cssnano()))
    .pipe(gulp.dest(config.theme.dest))
    .pipe($.size({ title: 'staging:theme' }))
    .pipe($.preservetime())
});
