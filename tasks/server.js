var gulp = require('gulp')
var browserSyncApi = require('browser-sync')

var config = require('../config').server

/**
 * サイトのプロキシを行うサーバーを起動
 */
gulp.task('server', function (cb) {
  var mode = 'development'
  var browserSync = browserSyncApi.create(mode)

  browserSync.init(config[mode], cb)
})
