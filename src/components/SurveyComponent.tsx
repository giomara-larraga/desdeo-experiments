import React, { useEffect } from "react";
import * as Survey from "survey-react-ui";
import { StylesManager } from 'survey-core';
import "survey-core/defaultV2.css";
StylesManager.applyTheme("defaultV2");
StylesManager.applyTheme("defaultV2");

interface ISurveyComponentProps{
    css:any;
    json:any;
    data:any;
    onComplete:(survey:any) => void;
}

const SurveyComponent = ({
    css,
    json,
    data,
    onComplete}: ISurveyComponentProps) => {
    useEffect(() => {
        StylesManager.applyTheme("bootstrap");

    }, []);
    return (
        <Survey.Survey
            css = {css}
            data = {data}
            json = {json}
            onComplete = {onComplete}
        />
    );
}
export default SurveyComponent;