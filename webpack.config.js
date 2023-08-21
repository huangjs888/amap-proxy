/*
 * @Author: Huangjs
 * @Date: 2021-10-21 16:11:29
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-21 14:14:12
 * @Description: ******
 */

const webpack = require('webpack');
const resolve = require('path').resolve;
const { NODE_ENV, MOD_ENV } = process.env;
const modname = MOD_ENV === 'cjs' ? 'commonjs' : MOD_ENV === 'esm' ? 'module' : 'umd';
const pathname = MOD_ENV === 'cjs' ? 'lib' : MOD_ENV === 'esm' ? 'es' : 'dist';

module.exports = {
  optimization: {
    minimize: NODE_ENV === 'production',
  },
  devtool: 'source-map',
  entry: {
    'amap-proxy': resolve(__dirname, 'src/index.js'),
  },
  output: {
    filename: `[name]${NODE_ENV === 'production' ? '.min' : ''}.js`,
    library: {
      name: modname === 'umd' ? 'AmapProxy' : undefined,
      type: modname,
    },
    path: resolve(__dirname, pathname),
  },
  experiments: {
    outputModule: modname === 'module',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  target: ['web', 'es5'], // webpack构建时候添加的代码片段按照web平台的es5输出
  plugins: [new webpack.optimize.AggressiveMergingPlugin()],
};
