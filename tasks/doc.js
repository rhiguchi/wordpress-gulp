var gulp = require('gulp')
var loadPlugins = require('gulp-load-plugins')
var marked = require('marked')
var swig = require('swig')
var path = require('path')
var fs = require('fs')
var through = require('through2')

var config = require('../config').doc

/**
 * ドキュメントファイルを生成
 */
gulp.task('doc', function () {
  var $ = loadPlugins()

  // マークダウンファイルにレイアウトテンプレートを適用する
  var applyTemplate = through.obj(function (file, enc, cb) {
    var layoutBase = path.dirname(file.path)
    var layoutFile = path.join(layoutBase, config.layoutFileName)
    var template = null

    // テンプレートを生成
    try {
      var layoutFileStat = fs.statSync(layoutFile)
      template = swig.compileFile(layoutFile)
    }
    catch (e) {
      // ファイルがないと例外になるがなにもしない
    }

    // マークダウンとしてファイルの中身をコンパイル
    marked(file.contents.toString(), function (err, content) {
      // エラーはコールバックに渡して処理を終了
      if (err) {
        cb(err)
        return
      }

      // テンプレートがあれば適用
      if (template) {
        // フォルダ名をタイトルに
        var title = path.basename(layoutBase)

        // テンプレートで利用するデータ
        var data = {
          title: title,
          content: content,
        }

        content = template(data);
      }

      file.contents = new Buffer(content, 'utf8');

      cb(null, file)
    })
  })

  return gulp.src(config.source)
    .pipe($.if('*.md', applyTemplate))
    .pipe($.extname())
    .pipe(gulp.dest(config.dest))
    .pipe($.size({ title: 'doc', showFiles: true }))
})
