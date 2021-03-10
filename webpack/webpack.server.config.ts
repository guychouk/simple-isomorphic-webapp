import path from "path";
import nodeExternals from "webpack-node-externals";
import { Configuration as WebpackConfiguration } from "webpack";

const { NODE_ENV } = process.env;
const DEV_MODE = NODE_ENV === "development";

export default <WebpackConfiguration>{
  externalsPresets: { node: true },
  externals: [nodeExternals()],
  entry: "./src/server/index.ts",
  mode: DEV_MODE ? "development" : "production",
  devtool: DEV_MODE ? "inline-source-map" : false,
  resolve: {
    extensions: [ ".ts", ".js" ]
  },
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
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
  plugins: [],
}
