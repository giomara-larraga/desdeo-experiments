import React, { useEffect, useState } from "react";
import { Survey, ReactQuestionFactory } from "survey-react-ui";
import { StylesManager } from "survey-core";
import "survey-core/survey.min.css";
//StylesManager.applyTheme("defaultV2");
//StylesManager.applyTheme("defaultV2");
//import "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-material-design/4.0.2/bootstrap-material-design.css";
import "survey-core/defaultV2.min.css";

import { Button, Box } from "@material-ui/core";
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
  return (
    <Box display="flex" flexDirection="column" width="100%">
      <Survey
        data={data}
        json={json}
        onComplete={onComplete}
        id="surveyElement"
      />
    </Box>
  );
};
export default SurveyComponent;
