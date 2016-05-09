/**
 * タスク間で共通の設定
 **/
var path = require('path')

// タスクで処理される元のディスプレイ
var themeSourceDir = 'src/theme/'
// タスクで処理された出力先
var themeDestDir = 'build/theme/'

function resolveSourceDir(pathFromSource) {
  return path.resolve(themeSourceDir, pathFromSource)
}

var lessSource = resolveSourceDir('*.less')
var babelSource = resolveSourceDir('*.js')

var config = {
  clean: {
    build: 'build',
  },

  theme: {
    dest: themeDestDir,
    less: {
      source: lessSource,
    },
    babel: {
      source: babelSource,
    },
    static: {
      source: [
        resolveSourceDir('**'),
        '!' + lessSource,
        '!' + babelSource,
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
