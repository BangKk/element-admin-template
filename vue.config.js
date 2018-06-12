module.exports = {
  productionSourceMap: false,
  devServer: {
    port: 80,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://yourApilocation.com',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
};
