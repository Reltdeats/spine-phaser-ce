/**
 * @author       Ruben García Vilà
 * @copyright    2023 Ruben García Vilà.
 * @license      {@link https://github.com/Reltdeats/spine-phaser-ce/blob/master/LICENSE|MIT License}
 */
const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const pkginfo = require('./package.json');

const copyVersion = parseInt(pkginfo.version.match(/([^.]*)$/)[0], 10) + 1;

const copy = `
/**
 * Copyright for the Phaser CE Spine Plugin software and its source files:
 * @author       Ruben García Vilà
 * @version      ${pkginfo.version.replace(/([^.]*)$/, copyVersion)}
 * @copyright    2023 Ruben García Vilà.
 * @license      {@link https://github.com/Reltdeats/spine-phaser-ce/blob/master/LICENSE|MIT License}
 *
 * Copyright for the Spine Runtimes software and its source files:
 * @author       Esoteric Software LLC
 * @copyright    Copyright (c) 2013-2023, Esoteric Software LLC
 * @licence      {@link https://github.com/EsotericSoftware/spine-runtimes/blob/master/LICENSE}
 * 
 */
`;

/**
 * @module   webpack/configuration
 *
 * Webpack configuration module. Generates a configuration according to
 * the specified environment and the arguments send by the command line script.
 * Official documentation https://webpack.js.org/configuration/.
 * Only --env arguments are considered.
 *
 * @arg       {('development'|'production')}    build   Configuration Enviorment.
 *
 * @example
 * webpack --env build=development
 *
 * @param     {Object}    env    Object that includes all the arguments of the executed script.
 * @return    {Object}           Webpack config object
 */
module.exports = (env) => {
  const entries = {
    spinePlugin: './index.js'
  };

  /**
   * Webpack plugins to be use. This array morphs depending on the enviorment
   * and the arguments passed.
   */
  const plugins = [
    new webpack.BannerPlugin({
      banner: copy,
      raw: true
    })
  ];

  /**
   * Reads the examples directory and appends it to the entries.
   */
  const exampleList = [];
  fs.readdirSync('./src/examples/js').forEach((example) => {
    const isExample = fs.statSync(path.join('./src/examples/js', example)).isFile();

    if (isExample && example !== 'common.js') {
      const exampleName = example.replace('.js', '');
      exampleList.push(exampleName);

      entries[example] = {
        import: `/examples/js/${example}`,
        filename: `./examples/js/${example}`
      };

      let scriptString = fs.readFileSync(path.join('./src/examples/js', example), 'utf8', (err) => { if (err) throw err; });
      scriptString = scriptString.replace('import \'./common\';\n\n', '');

      plugins.push(
        new HtmlWebpackPlugin({
          title: `${exampleName.charAt(0).toUpperCase() + exampleName.slice(1)} example`,
          filename: `./examples/${exampleName}.html`,
          templateParameters: {
            example: `${exampleName.charAt(0).toUpperCase() + exampleName.slice(1)} example`,
            script: example,
            code: scriptString
          },
          template: 'examples/template.ejs',
          inject: false,
          minify: false
        })
      );
    }
  });

  /**
   * Adds examples list
   */
  plugins.push(
    new HtmlWebpackPlugin({
      title: 'build',
      filename: './examples/index.html',
      templateParameters: {
        examples: exampleList
      },
      template: 'examples/index.ejs',
      inject: false,
      minify: false
    })
  );

  /**
   * Optimization configuration for production.
   */
  const minimizer = [
    new TerserPlugin({
      extractComments: false,
      terserOptions: {
        format: {
          comments: /Copyright for the Phaser CE Spine Plugin/gm
        }
      }
    }),
    '...'
  ];

  /**
   * Default Initial Configuration. This configuration is then merged
   * with enviorment specific options.
   */
  const commonConfig = {
    mode: 'development',
    context: path.resolve(__dirname, 'src'),
    entry: entries,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'spine-phaser-ce.min.js',
      clean: true
    },
    plugins,
    devtool: 'source-map',
    module: {
      rules: [
        { test: /\.ts?$/, loader: 'ts-loader', exclude: /(node_modules|bower_components)/ },
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              presets: [
                ['@babel/preset-env', {
                  targets: '> 0.25%, not dead'
                }]
              ],
              plugins: ['@babel/plugin-transform-runtime']
            }
          }
        },
        // Special loader logic for spine files
        {
          test: /examples\/*.(spine|spines).*\.(json|atlas|txt|png)$/,
          type: 'asset/resource',
          generator: {
            filename: '[path][name][ext]'
          }
        }
      ]
    },
    optimization: {
      minimize: false,
      moduleIds: 'deterministic'
    }
  };

  /**
   * Development configuration, merged with the common configuration.
   */
  const devConfig = {
    ...commonConfig,
    name: 'Development build',
    devServer: {
      open: ['/examples/index.html'],
      compress: true,
      port: 8081,
      watchFiles: ['src/**/*'],
      client: {
        overlay: true,
        progress: true
      }
    }
  };

  /**
   * Production configuration, merged with the common configuration.
   */
  const prodConfig = {
    ...commonConfig,
    name: 'Production build',
    mode: 'production',
    optimization: {
      minimize: true,
      minimizer,
      moduleIds: 'deterministic'
    }
  };

  /**
   * Returns the different configurations depending on the specified environment.
   */
  switch (env.build) {
    case 'development':
      return devConfig;
    case 'production':
      return prodConfig;
    default:
      return devConfig;
  }
};
