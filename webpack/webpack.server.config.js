const path = require("path");
const nodeExternals = require("webpack-node-externals");

const { NODE_ENV } = process.env;
const DEV_MODE = NODE_ENV === "development";

module.exports = {
  externalsPresets: { node: true },
  externals: [nodeExternals()],
  entry: [
    path.resolve(__dirname, "..", "src", "server", "index.ts"),
  ],
  mode: DEV_MODE ? "development" : "production",
  devtool: DEV_MODE ? "inline-source-map" : false,
  resolve: {
    extensions: [ ".ts", ".js" ]
  },
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "..", "dist")
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
