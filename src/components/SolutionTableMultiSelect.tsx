import React, { useEffect, useState } from "react";
import { Container, Tab, Table } from "react-bootstrap";
import { ObjectiveData, ObjectiveDatum } from "../types/ProblemTypes";

interface SolutionTableMultiSelectProps {
  objectiveData: ObjectiveData;
  activeIndices: number[];
  setIndices: React.Dispatch<React.SetStateAction<number[]>>;
  tableTitle: string;
}

function ArraysAreEqual(a1: number[], a2: number[]): boolean {
  const threshold: number = 1e-3;
  // check that a1 and a2 are of same length
  const differences: number[] = a1.map((value, index) => {
    return Math.abs(value - a2[index]);
  });
  const withinThreshold: boolean[] = differences.map((value) =>
    value < threshold ? true : false
  );

  return withinThreshold.every((value) => value);
}

function checkForSimilarArrays(data: ObjectiveDatum[]): [number[], number[]] {
  const isSimilarToSomething: number[] = [];
  let indices: number[] = [];

  for (let i = 0; i < data.length; i++) {
    indices.push(i);
  }
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (i === j) {
        // do not compare array to itself
        continue;
      } else if (
        isSimilarToSomething.includes(i) ||
        isSimilarToSomething.includes(j)
      ) {
        // do not exluce twice
        continue;
      }

      if (ArraysAreEqual(data[i].value, data[j].value)) {
        isSimilarToSomething.push(i);
      }
    }
  }
  return [isSimilarToSomething, indices];
}

function SolutionTableMultiSelect({
  objectiveData,
  activeIndices,
  setIndices,
  tableTitle,
}: SolutionTableMultiSelectProps) {
  const [keys, SetKeys] = useState<number[]>(activeIndices);
  const [data, SetData] = useState(objectiveData.values);
  const [doNotShow] = useState<number[]>(
    checkForSimilarArrays(objectiveData.values)[0]
  );
  const [indices] = useState<number[]>(
    checkForSimilarArrays(objectiveData.values)[1]
  );
  let lastIndex: number = -1;
  useEffect(() => {
    SetData(objectiveData.values);
  }, [objectiveData]);

  useEffect(() => {
    SetKeys(activeIndices);
  }, [activeIndices]);

  const ideal = objectiveData.ideal;
  const nadir = objectiveData.nadir;

  return (
    <Container>
      <Tab.Container id="table-of-alternatives">
        <h4>{tableTitle}</h4>
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
            <tr className={"tableInfo"}>
              <td>{"Best"}</td>
              {ideal.map((v, i) => {
                const v_ = objectiveData.directions[i] === 1 ? v : -v;
                return <td>{`${v_.toPrecision(4)}`}</td>;
              })}
            </tr>

            {data.map((datum, index: number) => {
              if (doNotShow.includes(index)) {
                return;
              } else {
                lastIndex = lastIndex + 1;
                return (
                  <tr
                    onClick={() => {
                      if (keys.includes(index)) {
                        setIndices(keys.filter((k) => k !== index));
                      } else {
                        setIndices([...keys, index]);
                      }
                    }}
                    className={keys.includes(index) ? "tableSelected" : ""}
                    key={index}
                  >
                    <td>{`#${indices[lastIndex] + 1}`}</td>
                    {datum.value.map((value, i) => {
                      return (
                        <td>
                          {objectiveData.directions[i] === 1
                            ? value.toPrecision(4)
                            : -value.toPrecision(4)}
                        </td>
                      );
                    })}
                  </tr>
                );
              }
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

export { SolutionTableMultiSelect, checkForSimilarArrays };
