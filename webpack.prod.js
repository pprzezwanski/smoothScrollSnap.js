const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'production',
  entry: {
    bundle: ['babel-polyfill', './src/app.js']/* ,
    onLoad: ['./src/onLoad.js'] */
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  performance: { hints: false },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg|ico)$/,
        loader: 'file-loader',
        query:{
          name: '[path][name].[ext]?[hash]',
          context: ''
        }
      },
      {
          test: /\.(eot|ttf|otf|woff|woff2|json|xml)$/,
          loader: 'file-loader',
          query:{
            name: '[path][name].[ext]?[hash]',
            context: ''
          }
      },
      {
          test: /\.(json|xml)$/,
          loader: 'file-loader',
          query:{
            name: '[path][name].[ext]?[hash]',
            context: ''
          }
      },
      {
          test: /\.(s*)css$/,
          use: [{ loader: "style-loader" }, { loader: "css-loader" }, { loader: "sass-loader" }]
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'js', 'vendor'),
        loader: 'file-loader',
        query:{
            name: '[path][name].[ext]?[hash]',
            context: ''
        }
      }/* ,
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      } */
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      excludeChunks: [ 'onLoad', 'style' ]
    }),
    new CopyWebpackPlugin([
      /* { from: './php/', to: './php/' }, */
      { from: './img/', to: './img/' },
      { from: './css/vendor/', to: './css/vendor/' },
      { from: './js/vendor/', to: './js/vendor/' }
    ]),
    new CleanWebpackPlugin(
      'dist' 
    )/* ,
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }) */
  ]
}
