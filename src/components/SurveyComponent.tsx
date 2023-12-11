import React, { useEffect, useState } from "react";
import { Survey, ReactQuestionFactory } from "survey-react-ui";
import { StylesManager } from "survey-core";
import "survey-core/survey.min.css";
//StylesManager.applyTheme("defaultV2");
//StylesManager.applyTheme("defaultV2");
//import "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-material-design/4.0.2/bootstrap-material-design.css";
import "survey-core/defaultV2.min.css";
import { Model } from "survey-core";
import { Box } from "@material-ui/core";
import "../style/survey.css";
import Button from "@mui/material/Button";
import { DoubleBorderLight } from "survey-core/themes";

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
  const survey = new Model(json);

  survey.showNavigationButtons = true;

  survey.completeText = "Next";
  survey.completedHtml = "Please wait";
  survey.applyTheme(DoubleBorderLight);
  //survey.showCompletedPage = false;
  return (
    <Box display="flex" flexDirection="column" width="100%">
      <Survey
        //data={data}
        //json={json}
        onComplete={onComplete}
        id="surveyElement"
        model={survey}
      />
    </Box>
  );
};
export default SurveyComponent;
