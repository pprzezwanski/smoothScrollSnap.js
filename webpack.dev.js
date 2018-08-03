const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin");
// const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    bundle: [/* 'babel-polyfill',  */'./src/app.js'],
    onLoad: [/* 'babel-polyfill',  */'./src/onLoad.js']
  },
  output: {
    filename: '[name].js',
    publicPath: '/'
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
            outputPath: './img/',
            name: '[name].[ext]?[hash]'
        }
      },
      {
          test: /\.(eot|ttf|otf|woff|woff2|json|xml)$/,
          loader: 'file-loader',
          query:{
              outputPath: './fonts/',
              name: '[name].[ext]?[hash]'
          }
      },
      {
          test: /\.(json|xml)$/,
          loader: 'file-loader',
          query:{
              outputPath: './data/',
              name: '[name].[ext]?[hash]'
          }
      },
      {
          test: /\.(s*)css$/,
          use: [{ loader: "style-loader" }, { loader: "css-loader" }, { loader: "sass-loader" }]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      excludeChunks: [ 'onLoad' ]
    })
  ]/* ,
  devServer: {
    proxy: {
      '/': {
        //target: 'http://localhost:8080/',
        target: 'http://localhost:81/Nikolet_Burzynska_com-production/',
        changeOrigin: true
      }
    }
  } */
    
  /* new BrowserSyncPlugin(
  {
      proxy: 'http://localhost:8080',
      files: [
          {
              match: [ */
//                  '**/*.php'
              /*  ],
              fn: function(event, file) {
                  if (event === "change") {
                      const bs = require('browser-sync').get('bs-webpack-plugin');
                      bs.reload();
                  }
              }
          }
      ]
  },
  {
      reload: false
  })*/
  
}
