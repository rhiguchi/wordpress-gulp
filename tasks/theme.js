var gulp = require('gulp')
var loadPlugins = require('gulp-load-plugins')
var runSequence = require('run-sequence')

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

  // Less ファイルのコンパイル
  var less = $.less({
      plugins: lessPlugins,
      paths: [
        'node_modules/sanitize.css',
      ],
    })
    .on('error', errorHandler)

  return gulp.src(config.less.source)
    .pipe($.sourcemaps.init())
    .pipe(less)
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(config.dest))
    .pipe($.size({ title: 'theme:styles', showFiles: true }))
})

gulp.task('theme:scripts', function () {
  var $ = loadPlugins()

  var through = require('through2')
  var browserifyApi = require('browserify')
  var babelify = require('babelify')

  var browserify = through.obj(function (file, enc, cb) {
    browserifyApi({
        entries: file,
        debug: true,
        transform: [babelify],
      })
      .bundle(function (err, res) {
        if (res) file.contents = res;

        cb(err, file);
      })
  })

  return gulp.src(config.babel.source)
    .pipe(browserify)
    .pipe(gulp.dest(config.dest))
    .pipe($.size({ title: 'theme:scripts', showFiles: true }))
})

gulp.task('theme:static', function () {
  var $ = loadPlugins()

  // 静的ファイル
  return gulp.src(config.static.source)
    .pipe($.newer(config.dest))
    .pipe(gulp.dest(config.dest))
    .pipe($.size({ title: 'theme:static', showFiles: true }))
    .pipe($.preservetime())
})
