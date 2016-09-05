var gulp = require('gulp')
var loadPlugins = require('gulp-load-plugins')
var mergeStream = require('merge-stream')
var lazypipe = require('lazypipe')

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

  var minify = lazypipe()
    .pipe(function () {
      return $.if('**/*.js', $.uglify({ preserveComments: 'some' }).on('error', $.util.log))
    })
    .pipe(function () {
      return $.if('**/*.css', $.cssnano({ autoprefixer: false }))
    })

  var defaultBuild = gulp.src(config.theme.source)
    .pipe(minify())
    .pipe(gulp.dest(config.theme.dest))

  var mobileBuild = gulp.src(config.theme.mobileSource)
    .pipe(minify())
    .pipe(gulp.dest(config.theme.mobileDest))

  return mergeStream(defaultBuild, mobileBuild)
    .pipe($.size({ title: 'staging:theme' }))
    .pipe($.preservetime())
});
