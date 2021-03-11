import Ajv, { JSONSchemaType, DefinedError } from "ajv";
import addFormats from "ajv-formats";
import { Collection, ObjectId } from "mongodb";
import express, { ErrorRequestHandler } from "express";

import { generateUser } from "../utils";
import UserSchema from "../types/user";

const router = express.Router();

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validator = ajv.compile(UserSchema);

router
  .route("/")
  .get(async (req, res) => {
    const users: Collection = req.app.locals.db.collections.users;
    let { limit = 10, page = 0 } = req.query;
    page = parseInt(page.toString());
    limit = parseInt(limit.toString());
    const docs = await users
      .find({})
      .sort({ _id: 1 })
      .skip(page > 0 ? (page - 1) * limit : 0)
      .limit(limit)
      .toArray();
    return res.status(200).json(docs);
  })
  .post(async (req, res) => {
    const users: Collection = req.app.locals.db.collections.users;
    if (validator(req.body)) {
      const inserted = await users.insertOne(req.body);
      return res.status(201).json(inserted.ops);
    } else {
      return res.status(500).json({ errors: validator.errors });
    }
  });

router
  .route(/(\w{24})/)
  .get(async (req, res) => {
    const users: Collection = req.app.locals.db.collections.users;
    const docs = await users.findOne({ _id: new ObjectId(req.params[0]) });
    return res.json(docs);
  })
  .delete(async (req, res) => {
    const users: Collection = req.app.locals.db.collections.users;
    const docs = await users.deleteOne({
      _id: new ObjectId(req.params[0]),
    });
    return res.status(200).json({});
  })
  .put(async (req, res) => {
    const { params, body } = req;
    const users: Collection = req.app.locals.db.collections.users;
    if (validator(req.body)) {
      const docs = await users.updateOne(
        { _id: new ObjectId(req.params[0]) },
        { $set: req.body }
      );
      return res.status(201).json({ _id: params[0], ...body });
    } else {
      return res.status(500).json({ errors: validator.errors });
    }
  });

router.route("/generate").get(async (req, res, next) => {
  const users: Collection = req.app.locals.db.collections.users;
  await users.remove({});
  const docs = Array.from({ length: 10000 }, generateUser);
  await users.insertMany(docs);
  return res.json(docs);
});

export default router;
