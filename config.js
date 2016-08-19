/**
 * タスク間で共通の設定
 **/
var path = require('path')
var packageGulpConfig = require('../package.json').wordpressGulp

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

  // サイトデータ構築
  build: {
    wordpress: {
      source: [
        'WordPress/**',
        'src/@(wp-content)/**',
        '!WordPress/wp-content{,/**}',
      ],
    },

    theme: {
      source: themeDestDir + '**',
      dest: 'build/site/' + themePath,
    },

    site: {
      source: [
        'src/site/**',
      ],
    },

    dest: 'build/site',
  },

  // ステージングデプロイ
  staging: {
    build: {
      source: ['wordpress/.htaccess', 'src/staging/.ht*'],
      dest: 'build/site',
    },
    ftp: {
      host: 's55-coreserver-jp.value-domain.com',
      user: 'scienced.dgi',
      parallel: 3,
    },
    source: [
      'build/site/**',
      '!build/site/wp-config.php',
      'build/site/.ht*',
    ],
    dest: '/',
  },

  // ドキュメント生成
  doc: {
    layoutFileName: 'layout.swig',
    source: [
      'src/doc/**',
      '!**/layout.swig',
    ],
    dest: 'build/doc',
  },
}

// プロジェクト固有の設定で上書き
if (packageGulpConfig) {
  var merge = require('merge')
  merge.recursive(config, packageGulpConfig)
}

module.exports = config
