import Ajv, { JSONSchemaType, DefinedError } from "ajv";
import addFormats from "ajv-formats";
import { Collection, ObjectId } from "mongodb";
import express, { ErrorRequestHandler } from "express";

import { generatePromotion } from "../utils";
import PromotionSchema from "../types/promotion";

const router = express.Router();

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validator = ajv.compile(PromotionSchema);

router
  .route("/")
  .get(async (req, res) => {
    const promotions: Collection = req.app.locals.db.collections.promotions;
    let { limit = 10, page = 0 } = req.query;
    page = parseInt(page.toString());
    limit = parseInt(limit.toString());
    const docs = await promotions
      .find({})
      .sort({ _id: 1 })
      .skip(page > 0 ? (page - 1) * limit : 0)
      .limit(limit)
      .toArray();
    return res.status(200).json(docs);
  })
  .post(async (req, res) => {
    const promotions: Collection = req.app.locals.db.collections.promotions;
    if (validator(req.body)) {
      const inserted = await promotions.insertOne(req.body);
      return res.status(201).json(inserted.ops);
    } else {
      return res.status(500).json({ errors: validator.errors });
    }
  });

router
  .route(/(\w{24})/)
  .get(async (req, res) => {
    const promotions: Collection = req.app.locals.db.collections.promotions;
    const docs = await promotions.findOne({ _id: new ObjectId(req.params[0]) });
    return res.json(docs);
  })
  .delete(async (req, res) => {
    const promotions: Collection = req.app.locals.db.collections.promotions;
    const docs = await promotions.deleteOne({
      _id: new ObjectId(req.params[0]),
    });
    return res.status(200).json({});
  })
  .put(async (req, res) => {
    const { params, body } = req;
    const promotions: Collection = req.app.locals.db.collections.promotions;
    if (validator(req.body)) {
      const docs = await promotions.updateOne(
        { _id: new ObjectId(req.params[0]) },
        { $set: req.body }
      );
      return res.status(201).json({ _id: params[0], ...body });
    } else {
      return res.status(500).json({ errors: validator.errors });
    }
  });

router.route("/generate").get(async (req, res, next) => {
  const promotions: Collection = req.app.locals.db.collections.promotions;
  await promotions.remove({});
  const docs = Array.from({ length: 10000 }, generatePromotion);
  await promotions.insertMany(docs);
  return res.json(docs);
});

export default router;
