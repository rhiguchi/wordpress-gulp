var gulp = require('gulp')
var path = require('path')
var gulpSize = require('gulp-size')

var themeConfig = require('../config').theme

/**
 * ファイルの変更を検知して再ビルドする
 */
gulp.task('watch:theme', function () {
  var config = require('../config').watch.theme

  // 静的ファイルの変更で再読み込み
  gulp.watch(path.join(config.static.base, '**'), ["theme:static"])

  // スタイルファイルの変更で再読み込み
  gulp.watch(config.less.source, ["theme:styles"])

  // スクリプトファイルの変更で再読み込み
  gulp.watch(themeConfig.babel.source, ["theme:scripts"])
})
