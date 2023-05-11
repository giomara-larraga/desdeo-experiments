import "./Svg.css";
import SimpleHorizontalBar from "./simpleHorizontalBar";
import { RectDimensions } from "../types/ComponentTypes";
import { MinOrMax } from "../types/ProblemTypes";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { CardContent, FormControl, Select } from "@material-ui/core";
import { Grid, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { useState } from "react";
import { Classification } from "../pages/nimbus/nimbusTypes";

interface HBWindowProps {
  ideal: number[];
  nadir: number[];
  directions: MinOrMax[];
  objectiveNames: string[];
  setReferencePoint:
    | React.Dispatch<React.SetStateAction<[number, number]>>
    | ((x: [number, number]) => void);
  referencePoint: number[];
  currentPoint: number[];
  setLevelsOK: React.Dispatch<React.SetStateAction<boolean>>;
  levelsOK: boolean;
  //classifications: Classification[];
  dimensionsMaybe?: RectDimensions;
}

interface ErrorMessages {
  [key: string]: any;
}

export const HBWindow = ({
  ideal,
  nadir,
  directions,
  objectiveNames,
  setReferencePoint,
  referencePoint,
  currentPoint,
  dimensionsMaybe,
  setLevelsOK,
  levelsOK,
}: HBWindowProps) => {
  const numObj = ideal.length;

  // console.log(objectiveData);
  const colors = [
    "#A6B1E1",
    "#EAB0D9",
    "#CBE2B0",
    "#FFEB99",
    "#F8A978",
    "#F6DFEB",
    "#94DAFF",
    "#F6D7A7",
    "#CAF7E3",
    "#FFB6B9",
  ];
  const colors_sup = [
    "#A6B1E150",
    "#EAB0D950",
    "#CBE2B050",
    "#FFEB9950",
    "#F8A97850",
    "#F6DFEB50",
    "#94DAFF50",
    "#F6D7A750",
    "#CAF7E350",
    "#FFB6B950",
  ];

  const [errorMessages, setErrorMessages] = useState<ErrorMessages>({});
  //const [isValid, setIsValid] = useState<boolean>(true);
  //const [inputRP, setInputRP] = useState<number[]>([]);

  function setErrorMessagePosition(errorText: string, i: number) {
    const updated = { ...errorMessages, [i]: errorText };
    setErrorMessages(updated);
  }

  function validateAspirationLevel(value: number, index: number) {
    // validation logic that defines is true or false
    let isValid = true;
    setErrorMessagePosition("", index);
    if (directions[index] === 1) {
      if (value < ideal[index]) {
        isValid = false;
        setErrorMessagePosition(
          `Value too small. Must be greater than ${ideal[index]}`,
          index
        );
        setLevelsOK(false);
      }
      if (value > nadir[index]) {
        isValid = false;
        setErrorMessagePosition(
          `Value too too large. Must be less than ${nadir[index]}`,
          index
        );
        setLevelsOK(false);
      }
    } else {
      if (value < -nadir[index]) {
        isValid = false;
        setErrorMessagePosition(
          `Value too small. Must be greater than ${-nadir[index]}`,
          index
        );
        setLevelsOK(false);
      }
      if (value > -ideal[index]) {
        isValid = false;
        setErrorMessagePosition(
          `Value too too large. Must be less than ${-ideal[index]}`,
          index
        );
        setLevelsOK(false);
      }
    }
    isValid = true;
    setLevelsOK(true);
    if (isValid) {
      setReferencePoint([parseFloat(value.toFixed(4)), index]);
    }
    // update error state in position i
    //const message = isValid ? "" : "This field has invalid value";
    //setErrorMessagePosition(message, index);

    // optional: set reference point

    // return is optional
    return isValid;
  }

  return (
    <div className="navigation-window">
      {Array.from({ length: numObj }, (_, i) => i).map((i) => {
        return (
          <Grid container spacing={2} sx={{ marginBottom: "1.5rem" }}>
            <Grid item xs={4}>
              <Typography sx={{ fontWeight: "bold" }}>
                {objectiveNames[i]}
              </Typography>
            </Grid>
            <Grid item xs={8} sx={{ display: "flex", justifyContent: "right" }}>
              {/* <Typography color={"gray"}>
                Previous preference: {currentPoint[i]}
              </Typography> */}
            </Grid>
            <Grid item xs={4}>
              <Box>
                <TextField
                  id="outlined-number"
                  label="Aspiration level:"
                  type="number"
                  //defaultValue={referencePoint[i].toFixed(4)}
                  value={referencePoint[i].toFixed(4)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ maxLength: 5 }}
                  error={!!errorMessages[i]}
                  helperText={errorMessages[i]}
                  onChange={(e) => {
                    setReferencePoint([parseFloat(e.target.value), i]);
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={8}>
              <SimpleHorizontalBar
                ideal={ideal[i]}
                nadir={nadir[i]}
                direction={directions[i]}
                index={i}
                setReferencePoint={setReferencePoint}
                referencePoint={referencePoint[i]}
                currentPoint={currentPoint[i]}
                color={colors[i]}
                color_sup={colors_sup[i]}
                dimensionsMaybe={dimensionsMaybe}
              ></SimpleHorizontalBar>
            </Grid>
          </Grid>
        );
      })}
    </div>
  );
};

export default HBWindow;
