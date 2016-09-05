var gulp = require('gulp')
var gulpSize = require('gulp-size')

/**
 * ファイルの変更を検知して再ビルドする
 */
gulp.task('watch:theme', function () {
  var config = require('../config').watch.theme

  // 静的ファイルの変更で再読み込み
  gulp.watch(config.static.source, ["theme:static"])

  // スタイルファイルの変更で再読み込み
  gulp.watch(config.styles.source, ["theme:styles"])

  // スクリプトファイルの変更で再読み込み
  gulp.watch(config.scripts.source, ["theme:scripts"])
})
