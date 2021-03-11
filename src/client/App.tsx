import _ from "lodash";
import styled from "styled-components";
import React, { useState, useEffect } from "react";

import { insertAt } from "../utils";
import { Table, Button } from "./components";
import {
  UserDocument,
  MongoDocument,
  User,
} from "../types/user";
import {
  deleteUser,
  newUser,
  fetchUsers,
  generateUsers,
} from "./UserService";

type ButtonActionEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

const App = () => {
  const [headers, setHeaders] = useState([] as Array<string>);
  const [tableData, setTableData] = useState([] as Array<UserDocument>);

  const onDelete = (e: ButtonActionEvent, user: UserDocument) => {
    const { _id: id } = user;
    (async () => {
      await deleteUser(id);
      setTableData(tableData.filter((td) => td._id !== id));
    })();
  };

  const onDuplicate = (e: ButtonActionEvent, promo: UserDocument) => {
    const { _id: id, ...doc } = promo;
    (async () => {
      const { body }: { body: Array<UserDocument> } = await newUser(
        doc
      );
      const i = _.findIndex(tableData, { _id: id });
      const updatedTableData = insertAt<UserDocument>(
        tableData,
        i,
        body[0]
      );
      setTableData(updatedTableData);
    })();
  };

  const seedDb = (e: ButtonActionEvent) => {
    (async () => {
      const users = await generateUsers();
      setHeaders(Object.keys(users[0]).filter((k) => k !== "_id"));
      setTableData(users);
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
        Generate 10K Users
      </Button>
      {tableData.length > 0 && (
        <Table headers={headers} data={tableData} actions={actions} />
      )}
    </div>
  );
};

export default App;
