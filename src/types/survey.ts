const defaultSurveyJSON = {  elements: [{
  name: "FirstName",
  title: "Enter your first name:",
  type: "text"
}, {
  name: "LastName",
  title: "Enter your last name:",
  type: "text"
}]};
const defaulsSurveyCSS = {
  header: 'bg-primary text-white p-3',
  body: 'none !important',
  completedPage: 'p-3'
};

const defaultSurveyData = {
};

const defaultSurveyConfig = {
  defaulsSurveyCSS,
  defaultSurveyData,
  defaultSurveyJSON
}

export default defaultSurveyConfig;