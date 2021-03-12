const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require ("webpack");

const { NODE_ENV } = process.env;
const DEV_MODE = NODE_ENV === "development";

module.exports = {
  target: "web",
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    path.resolve(__dirname, "..", "src", "client", "index.tsx"),
  ],
  mode: DEV_MODE ? "development" : "production",
  devtool: DEV_MODE ? "inline-source-map" : false,
  resolve: {
    extensions: [ ".tsx", ".ts", ".js" ]
  },
  output: {
    publicPath: '/',
    filename: "app.js",
    path: path.resolve(__dirname, "..", "dist", "public"),
  },
  module: {
    rules: [
      { 
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                sourceMap: DEV_MODE,
              }
            }
          }
        ],
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: path.resolve(__dirname, "..", "src", "client", "assets", "favicon.ico"), 
          to: path.resolve(__dirname, "..", "dist", "public", "favicon.ico"), 
        }
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "..", "src", "client", "assets", "index.html")
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
}
