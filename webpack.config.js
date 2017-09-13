const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ModernizrWebpackPlugin = require('modernizr-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map',
  devServer: {
    port: 3000,
    compress: true
  },
  plugins: [
    new ModernizrWebpackPlugin({
      'class-prefix': 'thc',
      'options': [
        'setClasses'
      ],
      'feature-detects': [
        'touchevents',
      ]
    }),
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new HtmlWebpackPlugin({
      title: 'Sudoku JS'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src/'),
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },

    ],
  }
};
