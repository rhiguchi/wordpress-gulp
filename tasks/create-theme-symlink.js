var gulp = require('gulp')
var config = require('../config')['create-theme-symlink']
var fs = require('fs')
var path = require('path')

/**
 * テーマのビルドフォルダのシンボリックリンクを、 src/wp-content/themes 内に作ります
 */
gulp.task('create-theme-symlink', function (cb) {
  // 出力先ディレクトリーからの相対パスを算出
  var dest = config.dest
  var destDir = path.parse(dest).dir
  var target = path.relative(destDir, config.source);

  fs.symlink(target, dest, 'dir', function (err) {
    if (err) return cb(err)

    if (!config.mobile) {
      cb()
      return
    }

    // モバイル用の作成
    var dest = config.mobile.dest
    var destDir = path.parse(dest).dir
    var target = path.relative(destDir, config.mobile.source)

    fs.symlink(target, dest, 'dir', cb)
  })
})
