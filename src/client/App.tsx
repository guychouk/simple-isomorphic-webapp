import _ from "lodash";
import styled from "styled-components";
import React, { useState, useEffect } from "react";

import { insertAt } from "../utils";
import { Table, Button } from "./components";
import {
  PromotionDocument,
  MongoDocument,
  Promotion,
} from "../types/promotion";
import {
  deletePromotion,
  newPromotion,
  fetchPromotions,
  generatePromotions,
} from "./PromotionsService";

type ButtonActionEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

const App = () => {
  const [headers, setHeaders] = useState([] as Array<string>);
  const [tableData, setTableData] = useState([] as Array<PromotionDocument>);

  const onDelete = (e: ButtonActionEvent, promo: PromotionDocument) => {
    const { _id: id } = promo;
    (async () => {
      await deletePromotion(id);
      setTableData(tableData.filter((td) => td._id !== id));
    })();
  };

  const onDuplicate = (e: ButtonActionEvent, promo: PromotionDocument) => {
    const { _id: id, ...doc } = promo;
    (async () => {
      const { body }: { body: Array<PromotionDocument> } = await newPromotion(
        doc
      );
      const i = _.findIndex(tableData, { _id: id });
      const updatedTableData = insertAt<PromotionDocument>(
        tableData,
        i,
        body[0]
      );
      setTableData(updatedTableData);
    })();
  };

  const seedDb = (e: ButtonActionEvent) => {
    (async () => {
      const promotions = await generatePromotions();
      setHeaders(Object.keys(promotions[0]).filter((k) => k !== "_id"));
      setTableData(promotions);
    })();
  };

  const actions = [
    {
      label: "Delete",
      handler: onDelete,
      styleProps: { important: true, small: true },
    },
    { label: "Duplicate", handler: onDuplicate, styleProps: { small: true } },
  ];

  return (
    <div>
      <Button onClick={seedDb} fullWidth style={{ margin: "0 0 20px 0" }}>
        Generate 10K Promotions
      </Button>
      {tableData.length > 0 && (
        <Table headers={headers} data={tableData} actions={actions} />
      )}
    </div>
  );
};

export default App;
