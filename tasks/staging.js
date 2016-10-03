var gulp = require('gulp')
var loadPlugins = require('gulp-load-plugins')
var gutil = require('gulp-util')
var ftp = require('vinyl-ftp')
var streamqueue = require('streamqueue');
var argv = require('yargs').argv

var config = require('../config').staging

/** ステージング環境のためのデータを構築します。 */
gulp.task('staging:build', ['build'], () => {
  var $ = loadPlugins()

  return gulp.src(config.build.source)
    // WordPress の .htaccess にステージング環境のための .htaccess を追記
    .pipe($.if('.htaccess', $.concat('.htaccess')))
    .pipe(gulp.dest(config.build.dest))
    .pipe($.size({ title: 'staging:build', showFiles: true }))
    .pipe($.preservetime())
});
