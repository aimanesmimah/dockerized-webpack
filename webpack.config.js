var webpack = require('webpack')

module.exports = {
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true',
    './index.ts',
  ],
  output: {
    filename: 'bundle.js',
    path: '/',
    publicPath: '/build/',
  },
  mode: process.env.ENV,
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
      }
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
}
