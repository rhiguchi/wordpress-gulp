/**
 * タスク間で共通の設定
 **/
// タスクで処理される元のディスプレイ
var themeSourceDir = 'src/theme/'
// タスクで処理された出力先
var themeDestDir = 'build/theme/'

var config = {
  theme: {
    dest: themeDestDir,
    less: {
      source: themeSourceDir + '*.less',
    },
    babel: {
      source: themeSourceDir + '*.js',
    },
    static: {
      source: [
        themeSourceDir + '**/*.{css,php}',
      ],
    },
  },

  // サーバータスクの設定
  server: {
    development: {
      open: false,
      proxy: 'www.dgincubation.co.jp.local',
      files: themeDestDir + '**',
    }
  }
}

module.exports = config
