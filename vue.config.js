module.exports = {
  productionSourceMap: false,
  devServer: {
    port: 80,
    disableHostCheck: true,
    proxy: {
      '/cn/api': {
        target: 'http://finance-api-dev.ankerjiedian.com',
        changeOrigin: true,
        pathRewrite: { '^/cn/api': '' }
      }
    }
  }
};
