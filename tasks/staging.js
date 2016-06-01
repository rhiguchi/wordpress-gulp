var gulp = require('gulp')
var loadPlugins = require('gulp-load-plugins')
var gutil = require('gulp-util')
var ftp = require('vinyl-ftp')
var streamqueue = require('streamqueue');
var argv = require('yargs').argv

var config = require('../config').staging

/** ステージング環境にアップロードします */
gulp.task('staging', ['staging:build'], () => {
  // FTP サーバーのパスワードを環境変数から取得する
  if (argv.ftppassword == null) {
    throw new Error('デプロイには ftppassword を指定する必要があります')
  }

  var ftpconf = Object.assign({
    password: argv.ftppassword,
    log: gutil.log,
  }, config.ftp);

  // FTP 接続
  var conn = ftp.create(ftpconf);

  // build/site フォルダ内のファイルをすべて FTP 転送でアップロードする。
  return gulp.src(config.source, { buffer: false })
    .pipe(conn.dest(config.dest))
});

/** ステージング環境のためのデータを構築します。 */
gulp.task('staging:build', ['staging:wordpress', 'staging:theme'], () => {
  var $ = loadPlugins()

  return gulp.src(config.build.source)
    // WordPress の .htaccess にステージング環境のための .htaccess を追記
    .pipe($.if('.htaccess', $.concat('.htaccess')))
    .pipe(gulp.dest(config.build.dest))
    .pipe($.size({ title: 'staging:build', showFiles: true }))
    .pipe($.preservetime())
});

gulp.task('staging:wordpress', () => {
  var $ = loadPlugins()

  return gulp.src(config.wordpress.source)
    .pipe($.newer(config.build.dest))
    .pipe(gulp.dest(config.build.dest))
    .pipe($.size({ title: 'staging:wordpress' }))
    .pipe($.preservetime())
});

/** ステージング環境のためにテーマファイルをサイトディレクトリーにコピー */
gulp.task('staging:theme', ['theme'], () => {
  var $ = loadPlugins()

  return gulp.src(config.theme.source)
    .pipe(gulp.dest(config.theme.dest))
    .pipe($.size({ title: 'staging:theme' }))
    .pipe($.preservetime())
});
