var gulp = require('gulp')
var gutil = require('gulp-util')
var ftp = require('vinyl-ftp')
var argv = require('yargs').argv

var config = require('../config').staging

/** ステージング環境にアップロードします */
gulp.task('staging', cb => {
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
