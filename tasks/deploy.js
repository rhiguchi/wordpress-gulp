var gulp = require('gulp')
var loadPlugins = require('gulp-load-plugins')
var ftp = require('vinyl-ftp')
var yargs = require('yargs')
var path = require('path')

var config = require('../config').deploy

/** サイトデータをデプロイします */
gulp.task('deploy:ftp', () => {
  var argv = yargs
    .choices('target', ['all', 'wp-content', 'theme'])
    .boolean('production')
    .argv

  // FTP サーバーのパスワードを環境変数から取得する
  if (argv.ftppassword == null) {
    throw new Error('デプロイには ftppassword を指定する必要があります')
  }

  var $ = loadPlugins()

  var ftpConfBase = config.staging

  // 公開用デプロイ先の設定
  if (argv.production) {
    ftpConfBase = config.production

    if (!ftpConfBase) {
      throw new Error('デプロイには production の設定が必要です')
    }
  }

  // デプロイ対象ディレクトリー設定（指定なしではテーマのみ）
  var targetDir = config[argv.target ? argv.target : 'theme']
  var source = targetDir.source
  var dest = targetDir.dest

  // 出力先ベースディレクトリー指定にあわせる
  if (ftpConfBase.destBaseDir != null) {
    dest = path.join(ftpConfBase.destBaseDir, dest)
  }

  // FTP 接続
  var conn = ftp.create(Object.assign({
    password: argv.ftppassword,
    log: $.util.log,
  }, ftpConfBase))

  // build/site フォルダ内のファイルをすべて FTP 転送でアップロードする。
  return gulp.src(source, { buffer: false })
    .pipe(conn.newer(dest))
    .pipe(conn.dest(dest))
})
