var gulp = require('gulp')

var themeConfig = require('../config').theme

/**
 * ファイルの変更を検知して再ビルドする
 */
gulp.task('watch:theme', function () {
  var config = require('../config').watch.theme

  // 静的ファイルの変更で再読み込み
  gulp.watch(themeConfig.static.source, ["theme:static"])

  // スタイルファイルの変更で再読み込み
  gulp.watch(config.less.source, ["theme:styles"])

  // スクリプトファイルの変更で再読み込み
  gulp.watch(themeConfig.babel.source, ["theme:scripts"])
})
