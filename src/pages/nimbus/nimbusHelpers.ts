import { Tokens } from "../../types/AppTypes";
import {
  ProblemInfo,
} from "../../types/ProblemTypes";
import { NimbusMethodProps, NimbusState, Classification } from "./nimbusTypes";

export const createMethod = async (apiUrl: string, tokens: Tokens, problemGroup:number, methodName:string) => {
  try {
    const methodCreation = { problemGroup: problemGroup, method: methodName };
    const res = await fetch(`${apiUrl}/method/create`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${tokens.access}`,
      },
      body: JSON.stringify(methodCreation),
    });

    if (res.status === 201) {
      const body = await res.json();
      console.log(body);
      // created!
    } else {
      console.log(`Got return code ${res.status}. Could not create method.`);
      // do nothing
    }
  } catch (e) {
    console.log(e);
    // Do nothing
  }
};

export const fetchProblemInfo = async (apiUrl: string, tokens: Tokens, problemGroup:number) => {

  try {
    const res = await fetch(`${apiUrl}/problem/access`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokens.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ problemGroup: problemGroup }),
    });

    if (res.status == 200) {
      // ok!
      const body = await res.json();
      const problemInfo : ProblemInfo = {
        problemId: body.problem_id,
        problemName: body.problem_name,
        problemType: body.problem_type,
        objectiveNames: body.objective_names,
        variableNames: body.variable_names,
        nObjectives: body.n_objectives,
        ideal: body.ideal,
        nadir: body.nadir,
        minimize: body.minimize,
    };
      return problemInfo;
    } else {
      //some other code
      console.log(`could not fetch problem, got status code ${res.status}`);
      return undefined;
    }
  } catch (e) {
    console.log(`could not fetch problem`);
    return undefined;
    // do nothing
  } 
};

export const inferClassifications = (barSelection: number[], preferredPoint: number[], activeProblemInfo:ProblemInfo, classifications:Classification[], classificationLevels: number[]) => {
  const isDiff = barSelection.map((v, i) => {
    const res =
      // The preferred point must be in the original scale to be compared with barSelection
      Math.abs(v - preferredPoint[i] * activeProblemInfo!.minimize[i]) < 1e-12
        ? false
        : true;
    return res;
  });
  const levels = classificationLevels;
  const classes = barSelection.map((value, i) => {
    if (!isDiff[i]) {
      // no change, return old classification
      return classifications[i];
    }
    if (activeProblemInfo?.minimize[i] === 1) {
      // minimization
      if (value > preferredPoint[i]) {
        // selected value is greater than currently preferred (worse)
        // Worsen until
        levels[i] = barSelection[i];
        return ">=" as Classification;
      } else if (value < preferredPoint[i]) {
        // selected value is less than currently preferred (better)
        // improve until
        levels[i] = barSelection[i];
        return "<=" as Classification;
      } else {
        // no change, keep as it is
        return classifications[i];
      }
    } else if (activeProblemInfo?.minimize[i] === -1) {
      // maximization
      // levels must be transformed back to original scale, hence the minus signs
      if (value > -1 * preferredPoint[i]) {
        // selected value is greater than currently preferred (better)
        // improve until
        levels[i] = -barSelection[i];
        return "<=" as Classification;
      } else if (value < -1 * preferredPoint[i]) {
        // selected value is less than currently preferred (worse)
        // worsen until
        levels[i] = -barSelection[i];
        return ">=" as Classification;
      } else {
        // no change, keep as it is
        return classifications[i];
      }
    } else {
      // something went wrong, return previous classification
      console.log("Encountered something strange in inferClassifications...");
      return classifications[i];
    }
  });
  return {levels: levels, classes: classes};
  //SetClassificationLevels(levels);
  //SetClassifications(classes);
};

export function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}