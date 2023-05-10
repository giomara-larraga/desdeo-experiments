import "./Svg.css";
import SimpleHorizontalBar from "./simpleHorizontalBar";
import { RectDimensions } from "../types/ComponentTypes";
import { MinOrMax } from "../types/ProblemTypes";

interface HBWindowProps {
  ideal: number[];
  nadir: number[];
  directions: MinOrMax[];
  setReferencePoint:
    | React.Dispatch<React.SetStateAction<[number, number]>>
    | ((x: [number, number]) => void);
  referencePoint: number[];
  currentPoint: number[];
  dimensionsMaybe?: RectDimensions;
}

export const HBWindow = ({
  ideal,
  nadir,
  directions,
  setReferencePoint,
  referencePoint,
  currentPoint,
  dimensionsMaybe,
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

  return (
    <div className="navigation-window">
      {Array.from({ length: numObj }, (_, i) => i).map((i) => {
        return (
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
        );
      })}
    </div>
  );
};

export default HBWindow;
