import React, { useEffect, useState } from "react";
import {
  Container,
  ListGroup,
  Tab,
  Row,
  Col,
  ListGroupItem,
} from "react-bootstrap";
import { ObjectiveData } from "../../types/ProblemTypes";
import { isConstructorDeclaration } from "typescript";

interface SolutionTableProps {
  objectiveData: ObjectiveData;
  activeIndices: number[];
  setIndices: React.Dispatch<React.SetStateAction<number[]>>;
  tableTitle: string;
}

function SolutionTable({
  objectiveData,
  activeIndices,
  setIndices,
  tableTitle,
}: SolutionTableProps) {
  const [keys, SetKeys] = useState<number[]>(activeIndices);
  const [data, SetData] = useState(objectiveData.values);

  useEffect(() => {
    SetData(objectiveData.values);
  }, [objectiveData]);

  useEffect(() => {
    SetKeys(activeIndices);
  }, [activeIndices]);

  return (
    <Container>
      <Tab.Container
        id="table-of-alternatives"
        /*
        activeKey={keys}
        onSelect={(k) => {
          SetKeys([...keys!, k!]);
        }}
        */
      >
        <ListGroup>
          <ListGroup.Item variant="dark" key={"header"} id="header">
            <Row>
              {objectiveData.names.map((name, i) => {
                return (
                  <Col>{`${name} (${
                    objectiveData.directions[i] === 1 ? "min" : "max"
                  })`}</Col>
                );
              })}
            </Row>
          </ListGroup.Item>
          {data.map((datum, index: number) => {
            console.log(data);
            return (
              <ListGroup.Item
                action
                variant={keys.includes(index) ? "info" : ""}
                onClick={() => {
                  if (keys.includes(index)) {
                    setIndices(keys.filter((k) => k !== index));
                  } else {
                    setIndices([...keys, index]);
                  }
                }}
                key={index}
                id={index.toString()}
              >
                <Row>
                  {datum.value.map((value, i) => {
                    return (
                      <Col>
                        {objectiveData.directions[i] === 1
                          ? value.toPrecision(4)
                          : -value.toPrecision(4)}
                      </Col>
                    );
                  })}
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Tab.Container>
    </Container>
  );
}

export default SolutionTable;
