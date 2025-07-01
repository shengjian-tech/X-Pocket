const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = defineConfig({
  publicPath: './', // 在打包时添加这段代码，处理静态资源找不到问题
  outputDir: 'X-Pocket', // 打包输出目录
  lintOnSave: false, // 关闭 ESLint 检查
  runtimeCompiler: true, // 启用运行时编译器
  productionSourceMap: false, // 打包去掉 .map 文件

  // 调整内部的 webpack 配置
  configureWebpack: {
    resolve: {
      fallback: {
        path: false,
        fs: false,
        assert: false,
        crypto: false,
        http: false,
        https: false,
        os: false,
        url: false,
        stream: false,
        zlib: false,
        net: false,
        tty: false,
        vm: false,
        process: false,
        perf_hooks: false,
        constants: false,
        util: false,
        tls: false,
        dgram: false,
        dns: false,
        
      },
    },
    plugins: [
      new NodePolyfillPlugin(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  },

  // 配置 webpack-dev-server 行为
  devServer: {
    open: process.platform === 'darwin', // 在 macOS 上自动打开浏览器
    host: '0.0.0.0', // 允许外部访问
    port: 8080, // 开发服务器端口
    proxy: null, // 配置代理
  },
})