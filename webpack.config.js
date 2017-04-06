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
// const folders = globby.sync([
//   `${__dirname}/src/controllers/**/*.js`,
//   `${__dirname}/src/components/**/*.js`
// ]);

let webpackentry = {}

/**
 * glob source directory,
 * - find controllers/components
 * - maniplate name to pack as
 *
 * controller   =>  controller/name.js
 * components   =>  component/name.js
 *
 * // example
 * controllers/category/subfolder/controller.js   =>  controllers/category-subfolder.js
 *
 * throws error if duplicate directory found (example ui/date-time vs ui-date-time)
 * return <obj> webpackentry;
 */

const srcDir = 'src';
webpackentry['mapbox'] = __dirname + '/src/mapbox.js';
webpackentry['mapzen'] = __dirname + '/src/mapzen.js';

// const pathFiles = globby.sync(__dirname + "src/**")
//   .map((path)=> {
//     let filename = path.split('src/').pop();
//     webpackentry[filename] = path;
// });

// const folderNames = folders
//   .map((folder) => {
//     // manipulate the path and format such that folder/function-name.js
//     let path = folder.slice(0, folder.lastIndexOf('/'));
//     let pathLastIndex = path.lastIndexOf(srcDir);
//     let nameSplit = path.slice(pathLastIndex + srcDir.length).split('/');
//     let name = [nameSplit.slice(0, 1), nameSplit.slice(1).join('-')].join('/');

//     // error handling with duplicate name    
//     if (webpackentry[name] !== undefined) {
//       debug(`WARNING!!! \nName: ${name} is already taken. \nAffected folders: \nSubfolder ${webpackentry[name]} \nIsolated folder: ${folder}`);
//       throw new Error('Can not override webpack entry with duplicate name');
//     }
//     webpackentry[name] = folder;
//   });


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
  resolve: {
    alias: {
      "app": path.resolve(__dirname, "src/app.js"),
      "lib": path.resolve(__dirname, "src/lib"),
      "components": path.resolve(__dirname, "src/components"),
      "controllers": path.resolve(__dirname, "src/controllers")
    }
  },
};

module.exports = config;