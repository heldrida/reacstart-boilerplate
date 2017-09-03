var config = require('config')
var fs = require('fs')
var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var rootDir = path.resolve(__dirname, '../')
var OfflinePlugin = require('offline-plugin')
const AutoDllPlugin = require('autodll-webpack-plugin')

// https://github.com/lorenwest/node-config/wiki/Webpack-Usage
fs.writeFileSync(path.resolve(rootDir, 'config/client.development.json'), JSON.stringify(config))

module.exports = {
  devtool: 'source-map',
  context: path.resolve(rootDir, 'src'),
  entry: ['babel-polyfill', './js/index.js'],
  output: {
    path: path.join(rootDir, '/dist/staging'),
    publicPath: '',
    filename: 'js/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true,
              sourceMap: true
            }
          }, 'sass-loader?sourceMap'],
          publicPath: '../'
        })
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: [
          'file-loader?name=[path][name].[ext]'
        ]
      },
      {
        test: /\.(jpg|png|gif|svg)$/i,
        exclude: /(node_modules)/,
        use: [
          'file-loader?name=[path][name].[ext]'
        ]
      },
      {
        test: /\.(webm|mp4)$/,
        use: [
          'file-loader?name=[path][name].[ext]&emitFile=false'
        ]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('css/[name].min.css'),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('staging'),
        'BUILDER': true
      }
    }),
    new AutoDllPlugin({
      filename: 'vendors.dll.js',
      path: 'js',
      entry: {
        vendor: [
          'react',
          'react-dom',
          'react-redux',
          'redux',
          'history/createBrowserHistory',
          'babel-polyfill'
        ]
      }
    }),
    new OfflinePlugin() // it's always better if OfflinePlugin is the last plugin added
  ],
  resolve: {
    alias: {
      config: path.resolve(rootDir, 'config/client.development.json')
    }
  }
}
