var gulp = require('gulp')
var loadPlugins = require('gulp-load-plugins')
var runSequence = require('run-sequence')
var mergeStream = require('merge-stream')
var lazypipe = require('lazypipe')
var merge = require('merge')

var config = require('../config').theme

/**
 * テーマデータを構築
 */
gulp.task('theme', function (cb) {
  runSequence(['theme:styles', 'theme:scripts'], 'theme:static', cb)
})

gulp.task('theme:styles', function () {
  var $ = loadPlugins()

  var lessPlugins = []

  if (config.less.autoprefix) {
    var Autoprefix = require('less-plugin-autoprefix')
    var autoprefixOptions = config.less.autoprefix

    lessPlugins.push(new Autoprefix(autoprefixOptions))
  }

  var errorHandler = function (error) {
    $.util.log(error.toString())
    this.emit('end')
  }

  var lessWithSourceMap = lazypipe()
    .pipe($.sourcemaps.init)
    .pipe(function less() {
      var options = merge.recursive({ plugins: lessPlugins }, config.less.options)
      return $.less(options).on('error', errorHandler)
    })
    .pipe($.sourcemaps.write)

  var defaultCompile = gulp.src(config.less.source)
    .pipe(lessWithSourceMap())
    .pipe(gulp.dest(config.dest))

  var mobileCompile = gulp.src(config.less.mobileSource)
    .pipe(lessWithSourceMap())
    .pipe(gulp.dest(config.mobileDest))

  return mergeStream(defaultCompile, mobileCompile)
    .pipe($.size({ title: 'theme:styles', showFiles: true }))
})

gulp.task('theme:scripts', function () {
  var $ = loadPlugins()

  var through = require('through2')
  var browserifyApi = require('browserify')

  function browserify() {
    return through.obj(function (file, enc, cb) {
      browserifyApi({
          entries: file,
          debug: true,
        })
        .transform('babelify')
        .transform('browserify-shim', { global: true })
        .bundle(function (err, res) {
          if (res) file.contents = res;

          cb(err, file);
        })
    })
  }

  var defaultCompile = gulp.src(config.browserify.source)
    .pipe(browserify())
    .pipe(gulp.dest(config.dest))

  var mobileCompile = gulp.src(config.browserify.mobileSource)
    .pipe(browserify())
    .pipe(gulp.dest(config.mobileDest))

  return mergeStream(defaultCompile, mobileCompile)
    .pipe($.size({ title: 'theme:scripts', showFiles: true }))
})

gulp.task('theme:static', function () {
  var $ = loadPlugins()

  // 静的ファイル
  var defaultCopy = gulp.src(config.static.source)
    .pipe($.newer(config.dest))
    .pipe(gulp.dest(config.dest))

  var mobileCopy = gulp.src(config.static.mobileSource)
    .pipe($.newer(config.mobileDest))
    .pipe(gulp.dest(config.mobileDest))

  return mergeStream(defaultCopy, mobileCopy)
    .pipe($.size({ title: 'theme:static', showFiles: true }))
    .pipe($.preservetime())
})
