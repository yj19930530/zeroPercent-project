const port = 8080
const path = require('path');
const resolve = dir => path.join(__dirname, dir);
module.exports = {
  publicPath: './',
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'));
  },
  css: {
    modules: false,
    extract: true,
    sourceMap: false,
    loaderOptions: {
      sass: {
        prependData: `@import "src/styles/index.scss";`
      }
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: port,
    open: false,
    https: false,
    disableHostCheck: true,
    proxy: {
      [process.env.VUE_APP_API_URL]: {
        target: `${process.env.VUE_APP_API_SERVICE}`,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_API_URL]: ''
        }
      },
    },
  },
}