import _ from "lodash";
import styled, { css } from "styled-components";
import React, { useState, useEffect, useRef } from "react";

import Button, { ButtonProps } from "./Button";
import { isDate, formatDate } from "../../utils";
import { MongoDocument } from "../../types/user";

const StyledTable = styled.table`
  width: 100%;
  border-spacing: 0;
  border-collapse: separate;

  thead,
  tbody tr {
    width: 100%;
    display: table;
    table-layout: fixed;
  }

  @media only screen and (max-width: 768px) {
    display: block;
    thead,
    tbody {
      display: block;
    }
  }
`;

const Header = styled.th<{ center?: boolean }>`
  ${(props) => (props.center ? "text-align: center" : "")};

  &:first-child {
    width: 5%;
  }

  @media only screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: -9999px;
    left: -9999px;
  }
`;

const TableHead = styled.thead`
  height: 2em;
  font-size: 16px;
  border-bottom: 1px solid black;
`;

const TableBody = styled.tbody`
  display: block;
  overflow-y: auto;
  max-height: 640px;
  table-layout: fixed;
  border-bottom: 1px solid black;
  border-radius: 0 0 12px 12px;
`;

const Cell = styled.td<{ center?: boolean }>`
  padding: 0 0.5em 0;
  ${(props) => (props.center ? "text-align: center;" : "")};

  &:first-child {
    width: 5%;
    border-left: 1px solid black;
  }
  &:last-child {
    border-right: 1px solid black;
  }

  @media only screen and (max-width: 768px) {
    &:before {
      content: attr(data-title);
      position: absolute;
      top: 6px;
      left: 6px;
      width: 45%;
      padding-right: 10px;
      white-space: nowrap;
      text-align: left;
      font-weight: bold;
    }
    display: block;
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
    white-space: normal;
    text-align: left;
  }
`;

const Row = styled.tr`
  &:nth-child(even) {
    background-color: ${(props) => props.theme.colors.evenRowColor};
  }

  @media only screen and (max-width: 768px) {
    display: block;
  }
`;

interface RowState {
  [key: string]: boolean;
}

interface TableProps {
  headers: Array<string>;
  data: Array<MongoDocument>;
  actions: Array<{
    label: string;
    handler: (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      doc: MongoDocument
    ) => void;
    styleProps: ButtonProps;
  }>;
}

const Table: React.FunctionComponent<TableProps> = ({
  headers,
  data,
  actions,
}) => {
  const tableRef = useRef<HTMLTableSectionElement>(null);
  const [dataWindowIndexes, setDataWindowIndexes] = useState({ start: 0, end: 100 });
  const [tableHeight, setTableHeight] = useState(0);
  const [dataWindow, setDataWindow] = useState([] as Array<MongoDocument>);
  const [selectedRows, setSelectedRows] = useState({} as RowState);

  const calcIndexes = (scrollTop?: number): { start: number; end: number } => {
    if (scrollTop === undefined || scrollTop === 0) {
      const indexes = { start: 0, end: 100 };
      setDataWindowIndexes(indexes);
      return indexes;
    }
    if (scrollTop >= tableHeight) {
      const { start, end } = dataWindowIndexes;
      const indexes = { start: start + 100, end: end + 100 };
      setDataWindowIndexes(indexes);
      return indexes;
    } else {
      const { start, end } = dataWindowIndexes;
      const indexes = { start: Math.max(start - 100, 0), end: Math.max(end - 100, 100) };
      setDataWindowIndexes(indexes);
      return indexes;
    }
  };

  const debouncedScrollHandler = _.debounce((e: React.SyntheticEvent) => {
    const scrollTop = (e.target as HTMLTableSectionElement).scrollTop;
    const { start, end } = calcIndexes(scrollTop);
    setDataWindow(data.slice(start, end));
  }, 150);

  useEffect(() => {
    const { start, end } = calcIndexes();
    setDataWindow(data.slice(start, end));
  }, [data]);

  useEffect(() => {
    if (tableRef.current && tableRef.current.clientHeight > 0) {
      setTableHeight(tableRef.current.clientHeight);
    }
  }, [dataWindow]);

  function toggleRow(event: React.SyntheticEvent, id: string) {
    selectedRows[id]
      ? setSelectedRows({ ...selectedRows, [id]: false })
      : setSelectedRows({ ...selectedRows, [id]: true });

    console.log("Selected Rows:", selectedRows);
  }

  return (
    <>
      <StyledTable>
        <TableHead>
          <Row>
            <Header center></Header>
            {headers.map((header, i) => (
              <Header center key={i}>
                {header}
              </Header>
            ))}
            <Header center></Header>
          </Row>
        </TableHead>
      </StyledTable>
      <div>
        <StyledTable>
          <TableBody ref={tableRef} onScroll={debouncedScrollHandler}>
            {dataWindow.map((obj, i) => {
              return (
                <Row key={obj._id}>
                  <Cell
                    center
                    key={`${obj._id}-0`}
                    onClick={(e) => toggleRow(e, obj._id)}
                  >
                    <input
                      type="checkbox"
                      id={`${i}`}
                      name={`${i}`}
                      checked={selectedRows[obj._id] === true}
                      onChange={(e) => toggleRow(e, obj._id)}
                    />
                  </Cell>
                  {Object.entries(obj).map(([key, value], i) => {
                    if (key === "_id") {
                      return undefined;
                    }
                    let val = value;
                    if (isDate(value)) {
                      val = formatDate(new Date(value));
                    } else if (typeof value.toString === "function") {
                      val = value.toString();
                    }
                    return (
                      <Cell data-title={key} key={`${key}-${i + 1}`}>
                        {val}
                      </Cell>
                    );
                  })}
                  <Cell center>
                    {actions.map(({ label, handler, styleProps }) => (
                      <Button
                        key={label}
                        onClick={(e) => handler(e, obj)}
                        style={{ margin: "5px 5px" }}
                        {...styleProps}
                      >
                        {label}
                      </Button>
                    ))}
                  </Cell>
                </Row>
              );
            })}
          </TableBody>
        </StyledTable>
      </div>
    </>
  );
};

export default Table;
