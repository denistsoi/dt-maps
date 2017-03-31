/**
 * Development Server
 */

const express    = require('express');
const quesadilla = require('quesadilla');
const cons    = require('consolidate');
const port    = process.env.PORT || 3000;
const debug   = require('debug')('pack');

const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('./webpack.config.js');

const compiler = webpack(config);
const middleware = webpackMiddleware(compiler, {
  publicPath: config.output.publicPath,
  contentBase: 'src',
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false
  }
});

const app = express();

app.engine('html', cons.ejs);
app.set('view engine', 'html');
app.set('views', `${__dirname}/views`);

app.use(middleware);
app.use(webpackHotMiddleware(compiler));
app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/dist`));
app.use(quesadilla(`${__dirname}/styles`));

app.get('/', (req,res)=>{
  res.render('index');
});

app.listen(port, ()=>{
  debug('server is listening to port: ', port);
});