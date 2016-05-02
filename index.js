var gulp = require('gulp')
var loadPlugins = require('gulp-load-plugins')
var requireDir = require('require-dir')
var runSequence = require('run-sequence')

gulp.task('default', ['theme'])

var config = require('./config').theme

gulp.task('theme', function (cb) {
  runSequence(['theme:styles', 'theme:scripts'], 'theme:static', cb)
})

/**
 * テーマデータを構築
 */
gulp.task('theme:styles', function () {
  var $ = loadPlugins()
  var Autoprefix = require('less-plugin-autoprefix')

  var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  var errorHandler = function (error) {
    $.util.log(error.toString())
    this.emit('end')
  }

  // Less ファイルのコンパイル
  var less = $.less({
      plugins: [
        new Autoprefix({ browsers: AUTOPREFIXER_BROWSERS }),
      ]
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
