/**
 * タスク間で共通の設定
 **/
var path = require('path')
var merge = require('merge')
var packageConfig = require('../package.json')
var packageGulpConfig = packageConfig.wordpressGulp || {}

// モバイルテーマの作成を行うか
var withMobileTheme = !!packageGulpConfig.withMobileTheme

// 名前の標準設定
var nameVarsDefault = {
  theme: packageConfig.name,
}

// 名前変数をパッケージ設定で上書き
var nameVars = merge(nameVarsDefault, packageGulpConfig.name)

// モバイル用子テーマの名前
nameVars.mobileTheme = nameVars.theme + '-mobile'

// タスクで処理される元のディスプレイ
var themeSourceDir = path.join('src', 'theme')
// モバイル用テーマのソースディレクトリー
var mobileThemeSourceDir = path.join('src', 'mobile-theme')
// テーマのソースディレクトリーパターン
var themeSourcePattern = '{' + [themeSourceDir, mobileThemeSourceDir].join(',') + '}'
// テーマタスクのコンパイルファイルの出力先
var themeCompiledDir = path.join('build', 'theme')
// テーマタスクのモバイル用テーマのコンパイルファイルの生成先
var mobileThemeCompiledDir = path.join('build', 'mobile-theme')

// Less コンパイルタスクで扱われるファイル名パターン
var lessFilePattern = path.join('**', '*.less');
// スクリプトコンパイルタスクで扱われるファイル名パターン
var scriptFilePattern = path.join('**', '*.js');

// テーマのビルド出力先
var buildThemeDir = path.join('build', 'site', 'wp-content', 'themes')

var config = {
  clean: {
    build: 'build',
  },

  "create-theme-symlink": {
    source: themeCompiledDir,
    dest: 'src/wp-content/themes/' + nameVars.theme,
    mobile: !withMobileTheme ? null : {
      source: mobileThemeCompiledDir,
      dest: 'src/wp-content/themes/' + nameVars.mobileTheme,
    },
  },

  theme: {
    dest: themeCompiledDir,
    mobileDest: mobileThemeCompiledDir,
    less: {
      // less で始まる名前のディレクトリーのファイルは less コンパイルを行わない
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
      },
      options: {
        paths: ['node_modules'],
      },
    },
    browserify: {
      source: path.join(themeSourceDir, scriptFilePattern),
      mobileSource: path.join(mobileThemeSourceDir, scriptFilePattern),
    },
    static: {
      source: [
        path.join(themeSourceDir, '**'),
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
      styles: {
        source: [
          path.join(themeSourceDir, lessFilePattern),
          path.join(mobileThemeSourceDir, lessFilePattern),
        ],
      },
      scripts: {
        source: [
          path.join(themeSourceDir, scriptFilePattern),
          path.join(mobileThemeSourceDir, scriptFilePattern),
        ],
      },
      static: {
        source: [
          path.join(themeSourcePattern, '**'),
          // '**/*.js' のようにすると起動に時間がかかりすぎてしまうためディレクトリー付きで指定
          '!' + path.join(themeSourcePattern, lessFilePattern),
          '!' + path.join(themeSourcePattern, scriptFilePattern),
        ],
      },
    },
  },

  // サーバータスクの設定
  server: {
    development: {
      open: false,
      files: path.join(themeCompiledDir, '**'),
    }
  },

  // サイトデータ構築
  build: {
    wordpress: {
      source: [
        'WordPress/**',
        'src/@(wp-content)/**',
        '!WordPress/wp-content{,/**}',
        "!src/wp-content/themes{,/**}",
      ],
    },

    theme: {
      source: path.join(themeCompiledDir, '**'),
      dest: path.join(buildThemeDir, nameVars.theme),
      mobileSource: path.join(mobileThemeCompiledDir, '**'),
      mobileDest: path.join(buildThemeDir, nameVars.mobileTheme),
      uglify: {
        preserveComments: 'some',
      },
      cssnano: {
        autoprefixer: false,
      },
    },

    site: {
      source: [
        path.join('src', 'site', '**'),
        path.join('src', 'site', '.ht*'),
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

  deploy: {
    theme: {
      source: path.join(buildThemeDir, '**'),
      dest: path.join('wp-content', 'themes'),
    },
    "wp-content": {
      source: path.join('build', 'site', 'wp-content', '**'),
      dest: 'wp-content',
    },
    all: {
      source: [
        path.join('build', 'site', '**'),
        '!' + path.join('build', 'site', 'wp-config.php'),
      ],
      dest: '',
    },
    staging: {
      host: 'example.com',
      user: 'guest',
      destBaseDir: '/',
    },
    production: {
      // 各プロジェクトの package.json で指定してください。
      // host: 'production.example.com',
      // user: 'guest',
      // destBaseDir: '/home/user/www',
    },
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
