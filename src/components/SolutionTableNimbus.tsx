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
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";

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
  const theme = useTheme();
  return (
    <Container>
      <TableContainer id="table-of-alternatives">
        {tableTitle.length > 0 && <h4>{tableTitle}</h4>}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                }}
              >
                {"Solution"}
              </TableCell>
              {objectiveData.names.map((name, i) => {
                return (
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                    }}
                  >{`${name} (${
                    objectiveData.directions[i] === 1 ? "min" : "max"
                  })`}</TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody
            style={{
              backgroundColor: selectedIndex !== null ? "#f5f5f5" : "white",
            }}
          >
            <TableRow className="tableInfo">
              <TableCell>{"Best"}</TableCell>
              {ideal.map((v, i) => {
                const v_ = objectiveData.directions[i] === 1 ? v : -v;
                return <TableCell>{`${v_.toPrecision(4)}`}</TableCell>;
              })}
            </TableRow>
            {data.map((datum, index) => {
              return (
                <TableRow
                  onClick={() => {
                    console.log("click!");
                    console.log(index);
                    SetKeySwitch(!keySwitch);
                    SetKey(index);
                  }}
                  key={index}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      index === selectedIndex ? "#D9D9D9" : "white",
                  }}
                >
                  <TableCell>{`#${index + 1}`}</TableCell>
                  {datum.value.map((value) => {
                    return (
                      <TableCell>{`${
                        objectiveData.directions[index] === 1
                          ? value.toPrecision(4)
                          : -value.toPrecision(4)
                      }`}</TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
            <TableRow className="tableInfo">
              <TableCell>{"Worst"}</TableCell>
              {nadir.map((v, i) => {
                const v_ = objectiveData.directions[i] === 1 ? v : -v;
                return <TableCell>{`${v_.toPrecision(4)}`}</TableCell>;
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default SolutionTable;
