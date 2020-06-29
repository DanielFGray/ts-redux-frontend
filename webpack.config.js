/* eslint-disable
   @typescript-eslint/no-var-requires,
   import/no-extraneous-dependencies,
   global-require */

const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const WebpackBar = require('webpackbar')
const { WebpackPluginServe } = require('webpack-plugin-serve')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const {
  NODE_ENV = 'development',
} = process.env

const devMode = NODE_ENV === 'development'

const cssLoaders = [
  {
    test: /node_modules[\\/].*\.css$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
    ],
  },
  {
    exclude: /node_modules/,
    test: /\.css$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      'postcss-loader',
    ],
  },
]

const babelLoader = {
  test: /\.[tj]sx?$/,
  exclude: /node_modules/,
  use: 'babel-loader',
}

const stats = {
  chunks: false,
  modules: false,
  colors: true,
}

const extensions = ['.ts', '.tsx', '.js', '.jsx']

/** @type {webpack.Configuration} */
const clientConfig = {
  name: 'client',
  mode: NODE_ENV,
  entry: [
    './src/index.tsx',
    'webpack-plugin-serve/client',
  ],
  devtool: devMode ? 'cheap-module-eval-source-map' : undefined,
  resolve: {
    extensions,
  },
  output: {
    path: path.resolve('./public'),
    publicPath: '/',
    filename: devMode ? '[name].js' : '[name]-[hash].js',
    chunkFilename: devMode ? '[name].js' : '[name]-[chunkhash].js',
  },
  module: {
    rules: cssLoaders.concat(babelLoader),
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name]-[hash].css',
      chunkFilename: devMode ? '[name].css' : '[name]-[chunkhash].css',
    }),
    new HtmlWebpackPlugin({
      title: "dfg.monster",
      inject: 'body',
      hash: ! devMode,
      mobile: true,
      appMountId: 'root',
      template: './src/html.ejs'
    }),
    // new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false, statsOptions: stats }),
  ],
  stats,
}

if (devMode) {
  clientConfig.plugins.push(new OptimizeCssAssetsPlugin())
  clientConfig.plugins.push(new WebpackBar())
  clientConfig.plugins.push(new WebpackPluginServe({
    historyFallback: true,
    port: 3000,
    progress: false,
    static: './public',
  }))
  clientConfig.watch = true
}

module.exports = clientConfig
