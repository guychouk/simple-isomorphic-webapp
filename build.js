const ClientConfig = require("./webpack/webpack.client.config.js")
const ServerConfig = require("./webpack/webpack.server.config.js")

const [ , , type ] = process.argv;

const webpack = require('webpack');

const compiler = webpack(type === 'server' ? ServerConfig : ClientConfig);

compiler.run((err, stats) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(stats.toString({
    chunks: false,  // Makes the build much quieter
    colors: true    // Shows colors in the console
  }));
})
