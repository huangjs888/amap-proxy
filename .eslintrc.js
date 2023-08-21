/*
 * @Author: Huangjs
 * @Date: 2021-10-21 15:05:51
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-18 17:32:37
 * @Description: ******
 */
module.exports = {
  env: {
    browser: true, // 涵盖浏览器全局变量
    es6: true, // 涵盖es6全局变量
    node: true, // 涵盖node全局变量
    jest: true, // 涵盖测试插件jest全局变量
  },
  globals: {
    define: true, // 自定义全局变量，如 jQuery: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {},
};
