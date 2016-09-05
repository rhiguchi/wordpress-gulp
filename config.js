/**
 * タスク間で共通の設定
 **/
var path = require('path')
var merge = require('merge')
var packageConfig = require('../package.json')
var packageGulpConfig = packageConfig.wordpressGulp || {}

// 名前の標準設定
var nameVarsDefault = {
  theme: packageConfig.name,
}

// 名前変数をパッケージ設定で上書き
var nameVars = merge(nameVarsDefault, packageGulpConfig.name)

// タスクで処理される元のディスプレイ
var themeSourceDir = 'src/theme/'
// モバイル用テーマのソースディレクトリー
var mobileThemeSourceDir = path.join('src', 'mobile-theme')
// タスクで処理された出力先
var themeDestDir = 'build/theme/'

// Less コンパイルタスクで扱われるファイル名パターン
var lessFilePattern = path.join('**', '*.less');
// スクリプトコンパイルタスクで扱われるファイル名パターン
var scriptFilePattern = path.join('**', '*.js');

function resolveSourceDir(pathFromSource) {
  return path.resolve(themeSourceDir, pathFromSource)
}

var config = {
  clean: {
    build: 'build',
  },

  "create-theme-symlink": {
    source: themeDestDir,
    dest: 'src/wp-content/themes/' + nameVars.theme,
  },

  theme: {
    dest: themeDestDir,
    mobileDest: 'build/mobile-theme/',
    less: {
      source: [
        path.join(themeSourceDir, lessFilePattern),
        '!' + path.join(themeSourceDir, 'less*', lessFilePattern),
      ],
      mobileSource: path.join(mobileThemeSourceDir, lessFilePattern),
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
    browserify: {
      source: path.join(themeSourceDir, scriptFilePattern),
      mobileSource: path.join(mobileThemeSourceDir, scriptFilePattern),
    },
    static: {
      source: [
        resolveSourceDir('**'),
        '!' + lessFilePattern,
        '!' + scriptFilePattern,
      ],
      mobileSource: [
        path.join(mobileThemeSourceDir, '**'),
        '!' + lessFilePattern,
        '!' + scriptFilePattern,
      ],
    },
  },

  watch: {
    theme: {
      static: {
        base: themeSourceDir,
      },
      less: {
        source: path.join(themeSourceDir, lessFilePattern),
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
      dest: 'build/site/wp-content/themes/' + nameVars.theme,
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
  merge.recursive(config, packageGulpConfig)
}

module.exports = config
