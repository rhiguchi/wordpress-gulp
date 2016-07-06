var gulp = require('gulp')
var loadPlugins = require('gulp-load-plugins')
var marked = require('marked')
var swig = require('swig')
var path = require('path')
var through = require('through2')

var config = require('../config').doc

/**
 * ドキュメントファイルを生成
 */
gulp.task('doc', function () {
  var $ = loadPlugins()
  var template = swig.compileFile(config.layout);

  // マークダウンファイルにレイアウトテンプレートを適用する
  var applyTemplate = through.obj(function (file, enc, cb) {
    // マークダウンとしてファイルの中身をコンパイル
    marked(file.contents.toString(), function (err, content) {
      // エラーはコールバックに渡して処理を終了
      if (err) {
        cb(err)
        return
      }

      // テンプレートで利用するデータ
      var data = {
        title: path.basename(file.path, '.md'),
        content: content,
      }

      file.contents = new Buffer(template(data), 'utf8');

      cb(null, file)
    })
  })

  return gulp.src(config.source)
    .pipe($.if('*.md', applyTemplate))
    .pipe($.extname())
    .pipe(gulp.dest(config.dest))
    .pipe($.size({ title: 'doc', showFiles: true }))
})
