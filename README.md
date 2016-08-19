# WordPress サイト構築 gulp タスク集 #


## プロジェクト固有の設定

`package.json` でタスクの標準設定を上書きできる。 `"wordpressGulp"` キーのオブジェクトに指定する。

```
{
  "wordpressGulp": {
    "path": {
      "build": "./site"
    }
  }
}
```

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
    "gulp": "^3.9.0",
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
    "less-plugin-autoprefix": "^1.5.1",
    "marked": "^0.3.5",
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
