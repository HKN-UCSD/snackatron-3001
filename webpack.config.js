const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const template = require('./src/App.js');

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        },
        include: path.resolve(__dirname, './src'),
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.svg$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './src/index.html',
      inject: true
    })
  ],
  devServer: {
    static: path.resolve(__dirname, './dist'),
    port: 8080
  },
  resolve: {
    fallback: {
      fs: false,
      net: false,
      dns: false,
      tls: false,
      child_process: false,

      url: require.resolve('url/'),
      util: require.resolve('util/'),
      assert: require.resolve('assert/'),
      buffer: require.resolve('buffer/'),
      os: require.resolve('os-browserify/browser'),
      path: require.resolve('path-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
      querystring: require.resolve('querystring-es3'),
    },
  },
};