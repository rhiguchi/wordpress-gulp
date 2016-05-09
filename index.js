var gulp = require('gulp')
var loadPlugins = require('gulp-load-plugins')
var requireDir = require('require-dir')
var runSequence = require('run-sequence')

require('./tasks/clean')
require('./tasks/server')
require('./tasks/theme')
require('./tasks/watch')

gulp.task('default', ['clean'], function (cb) {
  runSequence(['theme', 'watch:theme', 'server'], cb)
})
