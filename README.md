This is a demo of an isomorphic JS app which generates 10K users and presents them in a table.

The REST API is built with Node.js + Express ❤️.

The users are generated via a REST call to the server, and are stored in MongoDB.

The table in which the users are presented is built with React.

Both the server and client are written in TypeScript.

![Demo of the App](docs/demo.gif)
![Responsivity demo](docs/responsive.gif)

In this project you'll find two TS projects under the `src/` directory: `server` and `client`.  
Both the server and the client share TS modules code which reside in the `types/` and `utils/` directories.

## Development
- Run `nvm use` to set the Node.js version (12.18).
- Run `npm install`.
- Run `npm run dev`. This sets up the webpack development server and the MongoDB Docker container.  
  The dev server supports Hot Module Replacement and the client is setup with `react-hot-loader`.

The server is listening on `localhost:8081`.  
The mongodb container is listening on `localhost:27018`.
