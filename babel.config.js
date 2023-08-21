/*
 * @Author: Huangjs
 * @Date: 2023-08-10 15:01:13
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-21 11:57:04
 * @Description: ******
 */

const { MOD_ENV } = process.env;

module.exports = {
  targets:
    MOD_ENV === 'esm'
      ? { esmodules: true } // 目标浏览器是可以使用 ES Modules
      : {
          browsers: ['last 2 versions', 'IE 10'], // ie10 需要es5语法，所以Babel会将es678...全部转换为es5语法，还有其他配置可以看文档。
        },
  presets: [
    [
      '@babel/preset-env', // 根据下面的配置转换es语法，现需要安装@babel/preset-env依赖包
      {
        // 和上面的配置一样，可以覆盖上面的配置
        // targets: {
        //   ie: '10', // ie10 需要es5语法，所以Babel会将es678...全部转换为es5语法，还有其他配置可以看文档。
        // },
        // false的时候按照es6模块输出（保留import/export），可设置commonjs就会按照commonjs模块输出
        modules: MOD_ENV === 'esm' ? false : 'auto',
        // 尝试将已损坏的语法编译为目标浏览器支持的最接近的未损坏的现代语法
        bugfixes: true, // This option merges the features of @babel/preset-modules
        loose: true, // 松散模式
        // useBuiltIns是对于es678等新增的内置对象（如Symbol、Map、Set等）或原有内置对象新增的函数（如[].from，[].includes，[].forEach等）转低版本es如es5时，插入垫片。
        // useBuiltIns: 'usage', // 使用usage方式，Babel会参考目标浏览器（browserslist） 和 代码中所使用到的特性来按需加入polyfill，比较智能呢个，但是，注意，如果我们排除node_modules/目录，则引用的相关安装包有可能使用了未插垫片的特性，此时就可能报错，除非你找出那些包，将其不排除。
        // "useBuiltIns": "entry", // 使用entry,方式，则需要在我们的入口文件最上面加一句 import 'core-js';这样，转换的时候，就会一股脑把所有的垫片全部加进来，当然也就而已选择性导入 import "core-js/es/array";知道如数组相关的。需安装core-js@3依赖包。
        // "useBuiltIns": false,// 这个就是关闭垫片功能，不使用。
        // corejs: {
        //   version: '3.8', // 指名你所用的core-js安装包的版本，越高越好，这样就会涵盖更多的位置特性垫片
        //   proposals: true, // 包含一些提案的语法对象
        // },
      },
    ],
  ],
  plugins:
    MOD_ENV !== 'esm'
      ? [
          [
            '@babel/plugin-transform-runtime', // 目的是和上面的开启useBuiltIns一样，为了在运行时提供es6以上的内置对象及方法的垫片，需要安装@babel/plugin-transform-runtime依赖包。使用这个和上面的区别在于：上面是直接污染全局变量，在相关内置对象上加入垫片方法。而这个相当于是内部定义了这些垫片，文件使用到的地方，全部转换为调用该垫片，而不是在原有的对象上扩展垫片，并且还提供了复用代码的能力，不用在每个转换文件里都注入一边垫片语法
            {
              corejs: {
                // 不设置或设置false，则会直接使用@babel/runtime（无需安装），这个默认环境提供es6语法和内置对象。
                version: 3, // 指名你所用的@babel/runtime-corejs3安装包的版本，越高越好，这样就会涵盖更多的未知特性垫片包含了所有es5没有的。
                proposals: true, // 包含一些提案的语法对象
              },
            },
          ],
        ]
      : [],
};
/* @babel/preset-env 拥有根据 useBuiltIns 参数的多种polyfill实现，优点是覆盖面比较全（entry）， 缺点是会污染全局， 推荐在业务项目中使用
entry 的覆盖面积全， 但是打包体积自然就大，
useage 可以按需引入 polyfill, 打包体积就小， 但如果打包忽略node_modules 时如果第三方包未转译则会出现兼容问题
@babel/runtime 在 babel 7.4 之后大放异彩， 利用 corejs 3 也实现了各种内置对象的支持， 并且依靠 @babel/plugin-transform-runtime 的能力，沙箱垫片和代码复用， 避免帮助函数重复 inject 过多的问题， 该方式的优点是不会污染全局， 适合在类库开发中使用
上面 1， 2 两种方式取其一即可， 同时使用没有意义, 还可能造成重复的 polyfill 文件 */
// 可以百度@babel/preset-env 与@babel/plugin-transform-runtime 使用及场景区别相关文章并结合测试以及Babel和官方文档加以理解和区分
// https://blog.csdn.net/m0_37846579/article/details/103379084
// https://my.oschina.net/u/4293531/blog/3137171
// https://www.jianshu.com/p/ed24b0ba8792
