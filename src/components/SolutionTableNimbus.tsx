import React, { useEffect, useState } from "react";
import {
  Container,
  ListGroup,
  Tab,
  Row,
  Col,
  ListGroupItem,
  Table,
} from "react-bootstrap";
import { ObjectiveData } from "../types/ProblemTypes";

interface SolutionTableProps {
  objectiveData: ObjectiveData;
  setIndex: (x: number) => void;
  selectedIndex: number;
  tableTitle: string;
}

function SolutionTable({
  objectiveData,
  setIndex,
  selectedIndex,
  tableTitle,
}: SolutionTableProps) {
  const [key, SetKey] = useState<number>(selectedIndex);
  const [data, SetData] = useState(objectiveData.values);
  const [keySwitch, SetKeySwitch] = useState<boolean>(false);

  useEffect(() => {
    SetData(objectiveData.values);
  }, [objectiveData]);

  useEffect(() => {
    console.log("use effect");
    if (key === selectedIndex) {
      setIndex(-1);
    } else {
      setIndex(key);
    }
  }, [keySwitch]);

  useEffect(() => {
    console.log(objectiveData.values.length);
    if (objectiveData.values.length === 1) {
      setIndex(0);
    }
  }, [objectiveData]);

  useEffect(() => {
    SetKey(selectedIndex);
  }, [selectedIndex]);

  const ideal = objectiveData.ideal;
  const nadir = objectiveData.nadir;

  return (
    <Container>
      <Tab.Container id="table-of-alternatives">
        {tableTitle.length > 0 && <h4>{tableTitle}</h4>}
        <Table hover>
          <thead>
            <tr>
              <th>{"Solution"}</th>
              {objectiveData.names.map((name, i) => {
                return (
                  <th>{`${name} (${
                    objectiveData.directions[i] === 1 ? "min" : "max"
                  })`}</th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <tr className="tableInfo">
              <td>{"Best"}</td>
              {ideal.map((v, i) => {
                const v_ = objectiveData.directions[i] === 1 ? v : -v;
                return <td>{`${v_.toPrecision(4)}`}</td>;
              })}
            </tr>
            {data.map((datum, index) => {
              return (
                <tr
                  onClick={() => {
                    console.log("click!");
                    SetKeySwitch(!keySwitch);
                    SetKey(index);
                  }}
                  key={index}
                  className={index === selectedIndex ? "tableSelected" : ""}
                >
                  <td>{`#${index + 1}`}</td>
                  {datum.value.map((value) => {
                    return (
                      <td>{`${
                        objectiveData.directions[index] === 1
                          ? value.toPrecision(4)
                          : -value.toPrecision(4)
                      }`}</td>
                    );
                  })}
                </tr>
              );
            })}
            <tr className="tableInfo">
              <td>{"Worst"}</td>
              {nadir.map((v, i) => {
                const v_ = objectiveData.directions[i] === 1 ? v : -v;
                return <td>{`${v_.toPrecision(4)}`}</td>;
              })}
            </tr>
          </tbody>
        </Table>
      </Tab.Container>
    </Container>
  );
}

export default SolutionTable;
