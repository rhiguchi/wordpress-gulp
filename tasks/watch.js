var gulp = require('gulp')
var runSequence = require('run-sequence')
var del = require('del')
var path = require('path')

/**
 * ファイルの変更を検知して再ビルドする
 */
gulp.task('watch:theme', function () {
  var config = require('../config').watch.theme

  function syncFileEventHandler (event) {
    var baseDir = config.static.base
    var destDir = config.static.dest

    // 削除イベント時は出力先のファイルを削除
    if (event.type == "deleted") {
      var file = path.relative(baseDir, event.path)
      return del(path.join(destDir, file))
    }
    // それ以外時はファイルを上書き
    else {
      return runSequence('theme:static')
    }
  }

  // 静的ファイルの変更で再読み込み
  gulp.watch(config.static.source, syncFileEventHandler)

  // スタイルファイルの変更で再読み込み
  gulp.watch(config.styles.source, ["theme:styles"])

  // スクリプトファイルの変更で再読み込み
  gulp.watch(config.scripts.source, ["theme:scripts"])
})
