import { useEffect, useState, useCallback, Dispatch, SetStateAction } from "react";
import {
  ProblemInfo,
  ObjectiveData,
  ObjectiveDatum,
} from "../../types/ProblemTypes";
import { Tokens } from "../../types/AppTypes";
//import { Classification } from "./nimbusTypes";

export function useReadMOP(apiUrl:string, tokens:Tokens, problemGroup:number, SetActiveProblemInfo:Dispatch<SetStateAction<ProblemInfo | undefined>>):boolean {
  //const [activeProblemInfo, SetActiveProblemInfo] = useState<ProblemInfo>();
  //const [classifications, SetClassifications] = useState<Classification[]>([]);
  //const [classificationLevels, SetClassificationLevels] = useState<number[]>(
  //  []
  //);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [fetched, setFetched] = useState<boolean>(false);
  //let fetched:boolean = false;

  useEffect(() => {
    const fetchProblemInfo = async () => {
      setIsLoading(true);
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
          SetActiveProblemInfo({
            problemId: body.problem_id,
            problemName: body.problem_name,
            problemType: body.problem_type,
            objectiveNames: body.objective_names,
            variableNames: body.variable_names,
            nObjectives: body.n_objectives,
            ideal: body.ideal,
            nadir: body.nadir,
            minimize: body.minimize,
          });
          //SetClassifications(body.objective_names.map(() => "="));
          //SetClassificationLevels(body.objective_names.map(() => 0.0));
          //console.log("ya se pudo este jale");
        } else {
         
          //some other code
          console.log(`could not fetch problem, got status code ${res.status}`);
          setFetched(true);
        }
      } catch (e) {
        setError(e);
        setFetched(false);
        // do nothing
      } finally{
        setIsLoading(false);
        setFetched(true);
      }
    };

    fetchProblemInfo();
  }, []);
  return fetched;
}
