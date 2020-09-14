const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
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
      minimize: !isDev,
      minimizer: [
        new TerserPlugin({
          chunkFilter: (chunk) => {
            // Exclude uglification for the `vendor` chunk
            if (chunk.name === 'vendor') {
              return false;
            }

            return true;
          },
          sourceMap: isDev
        }),
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
        template: `${path.resolve(__dirname, 'src')}/index.html`
      })
    ],

    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          loader: 'worker-loader',
          include: [
            path.resolve(__dirname, 'src/'),
          ]
        },
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
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: {
                  localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
                },
                sourceMap: isDev
              }
            },
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
