/**
 * module dependencies
 * angular sample
 */
const webpack = require('webpack');
const globby = require('globby');
const debug = require('debug')('pack');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

// use path
const outputDir = `${__dirname}/dist`;
const sourceDir = 'src';

/**
 * append files in source directory to webpackentry
 */

let webpackentry = {
  vendor: [
    'chart.js',
    'mapbox-gl',
    'supercluster',
  ]
}

const glob = globby.sync(`${__dirname}/${sourceDir}/*.js`)
  .map((file)=>{
    let name = file.replace(`${__dirname}/${sourceDir}/`, '').replace('.js', '');
    webpackentry[name] = file;
});


const config = {
  entry: webpackentry,
  output: {
    path: outputDir,
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader?presets[]=es2015"
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest']
    })
  ],
  resolve: {
    // alias: {
    //   "app": path.resolve(__dirname, "src/app.js"),
    //   "lib": path.resolve(__dirname, "src/lib"),
    //   "components": path.resolve(__dirname, "src/components"),
    //   "controllers": path.resolve(__dirname, "src/controllers")
    // }
  },
};

module.exports = config;