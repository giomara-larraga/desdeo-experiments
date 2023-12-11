import React, { useEffect, useState } from "react";
import { ObjectiveData } from "../types/ProblemTypes";
import {
  Container,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableContainer,
  Paper,
  useTheme,
} from "@mui/material";

interface SolutionTableProps {
  objectiveData: ObjectiveData;
  setIndex: (x: number) => void;
  selectedIndex: number;
  tableTitle: string;
}

function SolutionTableShow({
  objectiveData,
  setIndex,
  selectedIndex,
  tableTitle,
}: SolutionTableProps) {
  const [key, SetKey] = useState<number>(selectedIndex);
  const [data, SetData] = useState(objectiveData.values);

  useEffect(() => {
    SetData(objectiveData.values);
  }, [objectiveData]);

  useEffect(() => {
    setIndex(key);
  }, [key]);

  useEffect(() => {
    SetKey(selectedIndex);
  }, [selectedIndex]);

  console.log("Got alternatives", objectiveData);

  const theme = useTheme();

  return (
    <Container>
      {tableTitle.length > 0 && <h4>{tableTitle}</h4>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {objectiveData.names.map((name, i) => (
                <TableCell
                  key={i}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  {`${name} (${
                    objectiveData.directions[i] === 1 ? "min" : "max"
                  })`}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/*           <TableRow>
            {objectiveData.names.map((name, i) => (
              <TableCell key={i}>{`${name} (${
                objectiveData.directions[i] === 1 ? "min" : "max"
              })`}</TableCell>
            ))}
          </TableRow> */}
            {data.map((datum, index) => (
              <TableRow
                key={index}
                onClick={() => SetKey(index)}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    index === selectedIndex ? "#e0e0e0" : "inherit",
                }}
              >
                {datum.value.map((value, index) => (
                  <TableCell
                    key={index}
                    style={{
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >{`${
                    objectiveData.directions[index] === 1
                      ? value.toPrecision(4)
                      : -value.toPrecision(4)
                  }`}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default SolutionTableShow;
