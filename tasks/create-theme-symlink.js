var gulp = require('gulp')
var fs = require('fs')

/**
 * テーマのビルドフォルダのシンボリックリンクを、 src/wp-content/themes 内に作ります
 */
gulp.task('create-theme-symlink', function (cb) {
  fs.symlink('../../../build/theme', 'src/wp-content/themes/beauty-wax', 'dir', cb)
})
