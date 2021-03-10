import path from "path";
import nodeExternals from "webpack-node-externals";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import webpack, { Configuration as WebpackConfiguration } from "webpack";

const { NODE_ENV } = process.env;
const DEV_MODE = NODE_ENV === "development";

export default <WebpackConfiguration>{
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
  devServer: {
    contentBase: path.join(__dirname, "..", "dist", "public"),
  },
}
