import React, { useEffect } from "react";
import * as Survey from "survey-react-ui";
import { StylesManager } from "survey-core";
import "survey-core/survey.min.css";
//StylesManager.applyTheme("defaultV2");
//StylesManager.applyTheme("defaultV2");

import "../style/survey.css";
interface ISurveyComponentProps {
  //css: any;
  json: any;
  data: any;
  onComplete: (survey: any) => void;
}

const SurveyComponent = ({
  //css,
  json,
  data,
  onComplete,
}: ISurveyComponentProps) => {
  /*useEffect(() => {
    StylesManager.applyTheme("bootstrap");
  }, []);*/
  return (
    <Survey.Survey
      data={data}
      json={json}
      onComplete={onComplete}
      id="surveyElement"
    />
  );
};
export default SurveyComponent;
