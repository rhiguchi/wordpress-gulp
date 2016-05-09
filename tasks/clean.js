var gulp = require('gulp')
var config = require('../config').clean
var del = require('del')

/**
 * ビルドデータを構築
 */
gulp.task('clean', function () {
  return del(config.build)
})
