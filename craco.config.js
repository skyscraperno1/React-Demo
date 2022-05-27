const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      // 这个plugin可以解析less！
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // 这里是配置全局样式：它实际上是POSTCSS的一个写法
            modifyVars: { '@primary-color': '#1d73a5' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  devServer:{
    proxy:{
      '/apis':{
        target:'http://www.shuiyue.info:20000',
        pathRewrite: {'/apis': ''}
      },
    }
  }
};