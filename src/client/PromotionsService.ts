import superagent from "superagent";
import prefix from "superagent-prefix";
import addFormats from "ajv-formats";
import Ajv, { JSONSchemaType, DefinedError } from "ajv";

import PromotionSchema, { Promotion } from "../types/promotion";

const DEV_URL = prefix("http://localhost:8081");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validator = ajv.compile(PromotionSchema);

export async function fetchPromotions(limit: number = 10, page: number = 1) {
  return superagent
    .get("/promotions")
    .set("accept", "json")
    .use(DEV_URL)
    .query({ limit, page });
}

export async function deletePromotion(id: string) {
  return superagent
    .delete(`/promotions/${id}`)
    .set("accept", "json")
    .use(DEV_URL);
}

export async function newPromotion(reqBody: Promotion) {
  if (validator(reqBody)) {
    return superagent
      .post("/promotions/")
      .send(reqBody)
      .set("accept", "json")
      .use(DEV_URL);
  } else {
    return Promise.reject({ errors: validator.errors });
  }
}

export async function generatePromotions() {
  const { body } = await superagent
    .get("/promotions/generate")
    .set("accept", "json")
    .use(DEV_URL);

  return body;
}
