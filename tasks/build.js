var gulp = require('gulp')
var loadPlugins = require('gulp-load-plugins')

var config = require('../config').build

/** サイトを構築します */
gulp.task('build', ['build:wordpress', 'build:theme'], () => {
  var $ = loadPlugins()

  return gulp.src(config.site.source)
    .pipe($.newer(config.dest))
    .pipe(gulp.dest(config.dest))
    .pipe($.size({ title: 'build' }))
    .pipe($.preservetime())
});

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

  cssnano = $.cssnano(config.theme.cssnano)

  return gulp.src(config.theme.source)
    .pipe($.if('**/*.js', uglify))
    .pipe($.if('**/*.css', cssnano))
    .pipe(gulp.dest(config.theme.dest))
    .pipe($.size({ title: 'staging:theme' }))
    .pipe($.preservetime())
});
