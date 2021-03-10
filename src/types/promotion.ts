import { JSONSchemaType, DefinedError } from "ajv";

type MongoDocument = {
  _id: string;
};

type Promotion = {
  name: string;
  type: "Basic" | "Common" | "Epic";
  startDate: string | Date;
  endDate: string | Date;
  userGroupName: string;
};

type PromotionDocument = Promotion & MongoDocument;

const PromotionSchema: JSONSchemaType<Promotion> = {
  type: "object",
  properties: {
    name: { type: "string" },
    type: { type: "string", enum: ["Basic", "Common", "Epic"] },
    startDate: { type: "string", format: "date-time" },
    endDate: { type: "string", format: "date-time" },
    userGroupName: { type: "string" },
  },
  required: ["name", "type", "startDate", "endDate", "userGroupName"],
  additionalProperties: false,
};

export default PromotionSchema;

export { Promotion, MongoDocument, PromotionDocument };
