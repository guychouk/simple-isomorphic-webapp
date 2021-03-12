import _ from "lodash";
import cors from "cors";
import { MongoClient, Db, Collection } from "mongodb";
import express, { ErrorRequestHandler } from "express";

import webpack, { Configuration as WebpackConfiguration } from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpackClientConfig from "../../webpack/webpack.client.config.js";

import UsersRouter from "./UsersRouter";

const app = express();

const defaultErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
};

const compiler = webpack(webpackClientConfig as WebpackConfiguration);

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackClientConfig.output?.publicPath as string,
  })
);

app.use(
  webpackHotMiddleware(compiler)
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(defaultErrorHandler);

app.use("/users", UsersRouter);

const uri = "mongodb://root:example@localhost:27018";
const mongoClient = new MongoClient(uri, { useUnifiedTopology: true });

(async () => {
  try {
    await mongoClient.connect();

    app.locals.db = {
      client: mongoClient,
      collections: {
        users: mongoClient.db("exampledb").collection("users"),
      },
    };

    const server = app.listen(8081, function () {
      const address = server.address();
      if (address === null) {
        throw new Error("Server not listening, exiting");
      }
      if (typeof address === "string") {
        console.log("Server listening at socket %s", address);
        return;
      }
      const { address: host, port } = address;
      console.log("Server listening at http://%s:%s", host, port);
    });
  } catch (err) {
    mongoClient.close();
    console.error(err.stack);
    process.exit(1);
  }
})();
