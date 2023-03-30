import React, { useEffect } from "react";
import * as Survey from "survey-react-ui";
import { StylesManager } from "survey-core";
import "survey-core/survey.min.css";
//StylesManager.applyTheme("defaultV2");
//StylesManager.applyTheme("defaultV2");
import { defaultCss } from "survey-core/plugins/bootstrap-material-integration";
//import "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-material-design/4.0.2/bootstrap-material-design.css";
import "survey-core/defaultV2.min.css";

//import "../style/survey.css";
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
  useEffect(() => {
    StylesManager.applyTheme("bootstrapmaterial");
  }, []);
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
