const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './entry.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Payroll Report',
      template: 'app/index.html.hbs'
    }),
    new webpack.ProvidePlugin({
      moment: "moment"
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../../dist/client/')
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  }
};
