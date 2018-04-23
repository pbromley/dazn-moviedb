'use strict';
const webpack = require('webpack');

module.exports = {
  cache: {},
  watch: (() => process.env.WATCH === 'true')(),
  entry: {
    app: ['babel-polyfill', './src/react/initialise-app.js']
  },
  output: {
    path: require('path').join(__dirname, '/', 'public/js'),
    filename: '[name]-bundle.js',
    chunkFilename: '[chunkhash].js',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['env', 'react', "es2017"]
        }
      }
    ]
  },
  plugins: (() => {
    const toApply = [];

    if (process.env.APP_DEBUG !== 'true') {
      toApply.push(new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }));
      toApply.push(new webpack.optimize.UglifyJsPlugin({
        mangle: false,
        sourceMap: true,
        comments: false
      }));
    }
    return toApply;
  })()
};
