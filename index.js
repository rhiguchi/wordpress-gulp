var gulp = require('gulp')
var loadPlugins = require('gulp-load-plugins')
var requireDir = require('require-dir')
var runSequence = require('run-sequence')

require('./tasks/clean')
require('./tasks/server')
require('./tasks/theme')

gulp.task('default', ['theme', 'watch:theme', 'server'])

var config = require('./config').theme

/**
 * ファイルの変更を検知して再ビルドする
 */
gulp.task('watch:theme', function () {
  // 静的ファイルの変更で再読み込み
  gulp.watch(config.static.source, ["theme:static"])

  // スタイルファイルの変更で再読み込み
  gulp.watch(config.less.source, ["theme:styles"])

  // スクリプトファイルの変更で再読み込み
  gulp.watch(config.babel.source, ["theme:scripts"])
})
