var gulp = require('gulp')
var loadPlugins = require('gulp-load-plugins')
var ftp = require('vinyl-ftp')
var yargs = require('yargs')

var config = require('../config').deploy

/** テーマファイルをデプロイします */
gulp.task('deploy:theme', () => {
  var argv = yargs.boolean('newer').boolean('production').argv

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

  // 出力先ディレクトリー
  var dest = config.theme.dest

  if (ftpConfBase.dest != null) dest = ftpConfBase.dest

  // FTP 接続
  var conn = ftp.create(Object.assign({
    password: argv.ftppassword,
    log: $.util.log,
  }, ftpConfBase))

  // build/site フォルダ内のファイルをすべて FTP 転送でアップロードする。
  return gulp.src(config.theme.source, { buffer: false })
    .pipe($.if(argv.newer, conn.newer(dest)))
    .pipe(conn.dest(dest))
})
