/**
 * タスク間で共通の設定
 **/
var path = require('path')

// タスクで処理される元のディスプレイ
var themeSourceDir = 'src/theme/'
// タスクで処理された出力先
var themeDestDir = 'build/theme/'
// 生成するテーマへの相対パス
var themePath = 'wp-content/themes/dgincubation-2016'

function resolveSourceDir(pathFromSource) {
  return path.resolve(themeSourceDir, pathFromSource)
}

var lessSource = resolveSourceDir('*.less')
var lessMixinSource = resolveSourceDir('less-mixin/*')
var babelSource = resolveSourceDir('*.js')

var config = {
  clean: {
    build: 'build',
  },

  theme: {
    dest: themeDestDir,
    less: {
      source: lessSource,
      autoprefix: {
        browsers: [
          'ie >= 10',
          'ie_mob >= 10',
          'ff >= 30',
          'chrome >= 34',
          'safari >= 7',
          'opera >= 23',
          'ios >= 7',
          'android >= 4.4',
          'bb >= 10'
        ]
      }
    },
    babel: {
      source: babelSource,
    },
    static: {
      source: [
        resolveSourceDir('**'),
        '!' + lessSource,
        '!' + lessMixinSource,
        '!' + babelSource,
      ],
    },
  },

  watch: {
    theme: {
      static: {
        base: themeSourceDir,
      },
      less: {
        source: [lessSource, lessMixinSource],
      },
    },
  },

  // サーバータスクの設定
  server: {
    development: {
      open: false,
      proxy: 'www.dgincubation.co.jp.local',
      files: themeDestDir + '**',
    }
  },

  // ステージングデプロイ
  staging: {
    compile: {
      source: ['wordpress/.htaccess', 'src/staging/.ht*'],
      dest: 'build/site',
    },
    // 生成されたテーマファイルの移動
    theme: {
      source: themeDestDir + '**',
      dest: 'build/site/' + themePath,
    },
    build: {
      static: {
        source: [
          'wordpress/**',
          '!wordpress/' + themePath,
        ],
      },
      dest: 'build/site',
    },
    ftp: {
      host: 's55-coreserver-jp.value-domain.com',
      user: 'scienced.dgi',
      parallel: 10,
    },
    source: ['build/site/**', 'build/site/.ht*'],
    dest: '/',
  },
}

module.exports = config
