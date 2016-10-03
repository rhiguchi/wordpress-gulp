# WordPress サイト構築 gulp タスク集 #

## deploy タスク

### オプション

* `--ftppassword [string]` - FTP のパスワードを設定します。
* `--target (all|wp-content|theme)` - デプロイ対象ファイルを指定します。無指定では `theme` です。
* `--newer` - 日付を比較して新しいファイルだけをデプロイします。
* `--production` - 本番環境にデプロイします。 `deploy.production` の設定が必要です。

### deploy:theme

テーマデータだけデプロイします。


## ディレクトリー構成

### src/theme

WordPress のテーマのためのソースファイル置き場。

### src/mobile-theme

WordPress のモバイル用テーマのためのソースファイル置き場。

## プロジェクト固有の設定

`package.json` でタスクの標準設定を上書きできる。 `"wordpressGulp"` キーのオブジェクトに指定する。

```
{
  "wordpressGulp": {
    "name": {
      "theme": "original-theme-name"
    },
    "path": {
      "build": "./site"
    }
  }
}
```

### `name` 設定

* `theme` - テーマ名。サイト構築時に `build/site/wp-content/themes` に出力される名前となる

### `withMobileTheme` 設定

    withMobileTheme: false

一部のタスクにモバイル用のテーマの処理を行わせるかの指定を行います。


## package.json のパッケージ

次のパッケージを利用していて、指定のバージョンで動作確認をしている。

```
  "devDependencies": {
    "babel-preset-es2015": "^6.3.13",
    "babelify": "^7.2.0",
    "browser-sync": "^2.10.0",
    "browserify": "^12.0.1",
    "del": "^2.2.0",
    "fastclick": "^1.0.6",
    "gulp": "^3.9.1",
    "gulp-concat": "^2.6.0",
    "gulp-cssnano": "^2.1.2",
    "gulp-extname": "^0.2.2",
    "gulp-if": "^2.0.1",
    "gulp-less": "^3.0.5",
    "gulp-load-plugins": "^1.1.0",
    "gulp-newer": "^1.1.0",
    "gulp-preservetime": "^1.0.0",
    "gulp-size": "^2.0.0",
    "gulp-sourcemaps": "^1.6.0",
    "gulp-uglify": "^1.5.3",
    "gulp-util": "^3.0.7",
    "lazypipe": "^1.0.1",
    "less-plugin-autoprefix": "^1.5.1",
    "marked": "^0.3.5",
    "merge": "^1.2.0",
    "merge-stream": "^1.0.0",
    "require-dir": "^0.3.0",
    "run-sequence": "^1.1.5",
    "sanitize.css": "^3.3.0",
    "streamqueue": "^1.1.1",
    "swig": "^1.4.2",
    "through2": "^2.0.1",
    "vinyl-ftp": "^0.4.5",
    "yargs": "^4.7.1"
  },
```
