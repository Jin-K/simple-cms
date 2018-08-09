const path = require('path');
const rxPaths = require('rxjs/_esm5/path-mapping');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpackTools = require('@ngtools/webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const helpers = require('./webpack.helpers');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const ROOT = path.resolve(__dirname, '..');

console.log('@@@@@@@@@ USING PRODUCTION @@@@@@@@@@@@@@@');

module.exports = {
  mode: 'production',
  entry: {
    polyfills: './src/polyfills.webpack.ts',
    vendor: './src/vendor.ts',
    app: './src/main-aot.webpack.ts'
  },

  output: {
    path: ROOT + '/wwwroot/',
    filename: 'dist/[name].[hash].bundle.js',
    chunkFilename: 'dist/[id].[hash].chunk.js',
    publicPath: '/'
  },

  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: rxPaths()
  },

  devServer: {
    historyApiFallback: true,
    stats: 'minimal',
    outputPath: path.join(ROOT, 'wwwroot/')
  },

  module: {
    rules: [
      {
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        use: '@ngtools/webpack',
        parser: {
          system: true
        }
      },
      {
        test: /\.(png|jpg|gif|woff|woff2|ttf|svg|eot)$/,
        use: 'file-loader?name=assets/[name]-[hash:6].[ext]',
        parser: {
          system: true
        }
      },
      {
        test: /favicon.ico$/,
        use: 'file-loader?name=/[name].[ext]',
        parser: {
          system: true
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        parser: {
          system: true
        }
      },
      {
        test: /\.scss$/,
        include: path.join(ROOT, 'src/styles'),
        use: ['style-loader', 'css-loader', 'sass-loader'],
        parser: {
          system: true
        }
      },
      {
        test: /\.scss$/,
        exclude: path.join(ROOT, 'src/styles'),
        use: ['raw-loader', 'sass-loader'],
        parser: {
          system: true
        }
      },
      {
        test: /\.html$/,
        use: 'raw-loader',
        parser: {
          system: true
        }
      },
      // Ignore warnings about System.import in Angular
      {
        test: /[\/\\]@angular[\/\\].+\.js$/,
        parser: {
          system: true
        }
      }
    ],
    exprContextCritical: false
  },
  plugins: [
    // new BundleAnalyzerPlugin({
    //  analyzerMode: 'static',
    //  generateStatsFile: true
    // }),
    new webpackTools.AngularCompilerPlugin({
      tsConfigPath: './tsconfig-aot.json'
      // entryModule: './src/app/app.module#AppModule'
    }),

    // new webpack.optimize.ModuleConcatenationPlugin(),

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),

    new CleanWebpackPlugin(['./wwwroot/dist', './wwwroot/assets'], {
      root: ROOT
    }),

    new webpack.NoEmitOnErrorsPlugin(),

    // new UglifyJSPlugin({
    //   parallel: 2
    // }),

    // new webpack.optimize.CommonsChunkPlugin({
    //   name: ['vendor', 'polyfills']
    // }),

    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // add errors to webpack instead of warnings
      failOnError: true,
      // allow import cycles that include an asyncronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      allowAsyncCycles: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: 'body',
      template: 'src/index.html'
    }),

    new CopyWebpackPlugin([
      { from: './src/images/*.*', to: 'assets/', flatten: true }
    ])
  ]
};
