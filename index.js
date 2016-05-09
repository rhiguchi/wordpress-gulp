var gulp = require('gulp')
var loadPlugins = require('gulp-load-plugins')
var requireDir = require('require-dir')
var runSequence = require('run-sequence')

requireDir('./tasks')

gulp.task('default', ['clean'], function (cb) {
  runSequence(['theme', 'watch:theme', 'server'], cb)
})
