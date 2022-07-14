const path = require('path');
module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias.set('@', path.join(__dirname, 'src'));
  },
  devServer: {
    proxy: {
      '': {
        target: 'http://192.168.1.119:8000',
        changeOrigin: true,
        secure: true
      }
    }
  }
};
