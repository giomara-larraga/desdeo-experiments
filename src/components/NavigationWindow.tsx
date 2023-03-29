import React, { useState } from "react";

import "d3-transition";
import "./Svg.css";
import NavigationBar from "./NavigationBar";
import { RectDimensions } from "../types/ComponentTypes";
import {
  NavigationData,
  NavigationDataSingleObjective,
} from "../types/ProblemTypes2";

interface NavigationWindowProps {
  objectiveData: NavigationData;
  handleReferenceValue:
    | React.Dispatch<React.SetStateAction<[number, number]>>
    | ((x: [number, number]) => void);
  handleBoundValue:
    | React.Dispatch<React.SetStateAction<[number, number]>>
    | ((x: [number, number]) => void);

  handleStep:
    | React.Dispatch<React.SetStateAction<number>>
    | ((x: number) => void);
  dimensionsMaybe?: RectDimensions;
}

export const NavigationWindow = ({
  objectiveData,
  handleReferenceValue,
  handleBoundValue,
  handleStep,
  dimensionsMaybe,
}: NavigationWindowProps) => {
  var singleObjectiveDataArray: NavigationDataSingleObjective[] = [];
  const [newStep, handleNewStep] = useState<number>();

  const numObj = objectiveData.objectiveNames.length;

  // console.log(objectiveData);
  let reachableColors: string[] = [];
  if (numObj === 3) {
    reachableColors = ["violet", "pink", "lightgreen"];
  }

  for (let i = 0; i < numObj; i++) {
    singleObjectiveDataArray.push({
      objectiveName: objectiveData.objectiveNames[i],
      objectiveID: i,
      ideal: objectiveData.ideal[i],
      nadir: objectiveData.nadir[i],
      minimize: objectiveData.minimize[i],
      upperReachables: objectiveData.upperBounds[i],
      lowerReachables: objectiveData.lowerBounds[i],
      referencePoints: objectiveData.referencePoints[i],
      bounds: objectiveData.boundaries[i],
      totalSteps: objectiveData.totalSteps,
      stepsTaken: objectiveData.stepsTaken,
      reachableColor: reachableColors[i],
    });
  }
  return (
    <div className="navigation-window">
      {singleObjectiveDataArray.map((data) => {
        return (
          <NavigationBar
            objectiveData={data}
            handleReferenceValue={handleReferenceValue}
            handleBoundValue={handleBoundValue}
            newStep={newStep}
            handleNewStep={(x: number) => {
              handleNewStep(x);
              handleStep(x);
            }}
            dimensionsMaybe={dimensionsMaybe}
            reachableColorMaybe={data.reachableColor}
          ></NavigationBar>
        );
      })}
    </div>
  );
};

export default NavigationWindow;
