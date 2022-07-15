/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-06-21 13:41:09
 * @LastEditTime: 2022-07-05 15:27:45
 * @LastEditors: Author
 */
const CracoLessPlugin = require('craco-less');
const path = require('path')
module.exports = {
  webpack: {
    // 配置别名
    alias: {
      // 约定：使用 @ 表示 src 文件所在路径
      '@': path.resolve(__dirname, 'src')
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.0.65:8800',
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [{
    plugin: CracoLessPlugin,
    options: {
      lessLoaderOptions: {
        lessOptions: {
          modifyVars: {
            '@primary-color': '#EF2424'
          },
          javascriptEnabled: true,
        },
      },
    },
  }, ]
}