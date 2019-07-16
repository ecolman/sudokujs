const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';

  return {
    mode: 'production',
    entry: {
      polyfills: './src/polyfills.js',
      app: './src/app.js'
    },
    output: {
      filename: '[name].[chunkhash:8].bundle.js',
      chunkFilename: '[name].[chunkhash:8].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },

    devtool: 'source-map',
    devServer: {
      port: 3000,
      compress: true
    },

    stats: 'minimal',
    optimization: {
      minimizer: [
        new UglifyJsPlugin()
      ],
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: `${path.resolve(__dirname, 'src', 'ui')}/index.html`
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
          test: /\.less$/,
          use: [
            'style-loader',
            'css-loader',
            'less-loader'
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/'
            }
          }]
        }
      ]
    }
  }
};
