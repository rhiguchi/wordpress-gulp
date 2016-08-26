var gulp = require('gulp')
var fs = require('fs')
var path = require('path')

/**
 * テーマのビルドフォルダのシンボリックリンクを、 src/wp-content/themes 内に作ります
 */
gulp.task('create-theme-symlink', function (cb) {
  // 出力先ディレクトリーからの相対パスを算出
  var dest = 'src/wp-content/themes/beauty-wax'
  var destDir = path.parse(dest).dir
  var target = path.relative(destDir, 'build/theme');

  fs.symlink(target, dest, 'dir', cb)
})
