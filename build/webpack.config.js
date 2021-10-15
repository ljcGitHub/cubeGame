const path = require('path')
const config = require('./config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const uglifyjs = require('uglifyjs-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '../', dir)
}

const isDev = process.env.NODE_ENV !== 'production'

//使用node的模块
const webpackConfig = {
  //这就是我们项目编译的入口文件
  entry: "./src/index.js",
  output: {
    filename: "main.js"
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': resolve('src')
    }
  },
  //这里可以配置一些对指定文件的处理
  //这里匹配后缀为ts或者tsx的文件
  //使用exclude来排除一些文件
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          resolve(__dirname, '/node_modules/'),
          resolve(__dirname, '/src/common/libs')
        ],
        loader: 'babel-loader'
      }
    ]
  },
  //这个参数就可以在webpack中获取到了
  devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',
  devServer: {
    //当你有错误的时候在控制台打出
    stats: 'errors-only',
    //不启动压缩
    compress: false,
    host: '0.0.0.0',
    contentBase: resolve('public'),
    publicPath: config.dev.assetsPublicPath,
    port: 9999
  },
  //这里就是一些插件
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['./dist']
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
}
if (!isDev) {
  webpackConfig.plugins.push(
    new uglifyjs() //压缩js
  )
  webpackConfig.plugins.push(
    new CopyPlugin({
      patterns: [
        { 
          from: resolve('public/assets'),
          to: resolve('dist/assets')
        }
      ]
    })
  )
}

module.exports = webpackConfig