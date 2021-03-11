import superagent from "superagent";
import prefix from "superagent-prefix";
import addFormats from "ajv-formats";
import Ajv, { JSONSchemaType, DefinedError } from "ajv";

import UserSchema, { User } from "../types/user";

const DEV_URL = prefix("http://localhost:8081");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validator = ajv.compile(UserSchema);

export async function fetchUsers(limit: number = 10, page: number = 1) {
  return superagent
    .get("/users")
    .set("accept", "json")
    .use(DEV_URL)
    .query({ limit, page });
}

export async function deleteUser(id: string) {
  return superagent
    .delete(`/users/${id}`)
    .set("accept", "json")
    .use(DEV_URL);
}

export async function newUser(reqBody: User) {
  if (validator(reqBody)) {
    return superagent
      .post("/users/")
      .send(reqBody)
      .set("accept", "json")
      .use(DEV_URL);
  } else {
    return Promise.reject({ errors: validator.errors });
  }
}

export async function generateUsers() {
  const { body } = await superagent
    .get("/users/generate")
    .set("accept", "json")
    .use(DEV_URL);

  return body;
}
