import { useEffect, useState } from "react";
import { Tokens } from "../../types/AppTypes";
import {
  ProblemInfo,
  ObjectiveData,
  ObjectiveDatum,
} from "../../types/ProblemTypes";
import { NimbusState } from "./nimbusTypes";

export function useStartMethod(apiUrl:string, tokens:Tokens, activeProblemInfo:ProblemInfo, methodName:string) {
  
  const [methodStarted, SetMethodStarted] = useState<boolean>(false);
  const [helpMessage, SetHelpMessage] = useState<string>(
    "Method not started yet."
  );
  const [preferredPoint, SetPreferredPoint] = useState<number[]>([]);
  const [currentState, SetCurrentState] = useState<NimbusState>("not started");
  const [classificationLevels, SetClassificationLevels] = useState<number[]>(
    []
  );
  const [nIteration, SetNIteration] = useState<number>(0);

  useEffect(() => {
    if (activeProblemInfo === undefined) {
      // no active problem, do nothing
      console.log("Active problem not defined yet.");
      return;
    }

    if (methodStarted) {
      // method already started, do nothing
      return;
    }
    // start the method
    const startMethod = async () => {
      try {
        const res = await fetch(`${apiUrl}/method/control`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        });

        if (res.status == 200) {
          const body = await res.json();
          SetMethodStarted(true);
          SetPreferredPoint([...body.response.objective_values]); // make copy to avoid aliasing
          SetClassificationLevels(body.response.objective_values);
          SetHelpMessage("Please classify each of the shown objectives.");
          SetCurrentState("classification");
          SetNIteration(1);
        }
      } catch (e) {
        console.log("not ok, could not start the method");
        console.log(`${e}`);
      }
    };

    startMethod();
  }, [methodStarted]);
  return [methodStarted];
}
