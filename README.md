This is a demo of an isomorphic JS app which generated 10K users and presents them in a table.

The REST API was built with Node.js + Express ❤️.

The users are generated via a REST call to the server, and are stored in MongoDB.

The table in which the users are presented was built with React.

This whole project is written in TypeScript.

![Demo of the App](docs/demo.gif)
![Responsivity demo](docs/responsive.gif)

In this project you'll find that under the `src/` directory there are two TS projects: `server` and `client`.  
Both the server and the client share code which resides in the `types/` and `utils/` directories.

## Development
- Run `nvm use` to set the proper Node.js version (12.18).
- Run `npm install`.
- Run `npm run dev`. This sets up the dev server and the mongodb Docker container.

The server is listening on `localhost:8081`.  
The mongodb instance is listening on `localhost:27018`.
