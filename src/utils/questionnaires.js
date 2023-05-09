export const demographic = {
    "elements": [{
      "name": "age",
      "type": "text",
      "title": "Age",
      "inputType": "number",
      "min": 0,
      "max": 100,
      "defaultValue": 0,
      "isRequired": true
    }, {
        "type": "dropdown",
        "name": "gender",
        "title": "Gender",
        "isRequired": true,
        "showNoneItem": false,
        "showOtherItem": false,
        "choices": [ "Male", "Female", "Non-binary"]
    }, {
      "name": "background",
      "type": "text",
      "title": "Background",
      "description":"Type of bachelor degree",
      "isRequired": true,
    }, {
      "name": "knowledge",
      "type": "text",
      "title": "Did you have any prior knowledge about these methods other than what you have learnt in this course?",
    }],
    "showQuestionNumbers": true
  };

  export const prequestionnaire = {
    "elements": [{
      "name": "tired",
      "type": "rating",
      "title": "I am now feeling tired.",
      "isRequired": true,
      "minRateDescription": "Not tired",
      "maxRateDescription": "Very tired"

    }, {
      "type": "multipletext",
      "name": "pricelimit",
      "title": "How much would you be willing to pay for a product like ours?",
      "isRequired": true,
      "items": [
        {
          "name": "mostamount",
          "title": "Highest price",
          "inputType": "number",
          "validators": [{
            "type": "expression",
            "expression": "{pricelimit.mostamount} >= {pricelimit.leastamount}",
            "text": "The highest price must be higher than the lowest price."
          }, {
            "type": "numeric",
            "minValue": 0,
            "text": "Price cannot be less than zero."
          }]
        },
        {
          "name": "leastamount",
          "title": "Lowest price",
          "inputType": "number",
          "validators": [{
            "type": "numeric",
            "minValue": 0,
            "text": "Price cannot be less than zero."
          }]
        }
      ]
    },],
    "showQuestionNumbers": true
  };


  export const postquestionnaire = {
    "pages": [
      {
        "title": "A GENERAL QUESTION HERE",
        "elements": [
            {
              "type": "matrix",
              "name": "quality",
              "title": "Please indicate if you agree or disagree with the following statements",
              "columns": [{
                "value": 5,
                "text": "Strongly agree"
              }, {
                "value": 4,
                "text": "Agree"
              }, {
                "value": 3,
                "text": "Neutral"
              }, {
                "value": 2,
                "text": "Disagree"
              }, {
                "value": 1,
                "text": "Strongly disagree"
              }],
              "rows": [
                {
                  "value": "tired2",
                  "text": "I am now feeling tired"
                },
                {
                  "value": "best",
                  "text": "I think that the solution I found is the best one."
                },
                {
                  "value": "better than others",
                  "text": "I am satisfied with my final solution"
                },
              ],
              "alternateRows": true,
              "isAllRowRequired": true
            }, {
                "name": "expectations2",
                "type": "text",
                "title": "Please describe why you are satisfied/disatisfied with your final solution",
                "isRequired": true,
            }
          ],
          "showQuestionNumbers": "off"
      },{
        "title": "A GENERAL QUESTION HERE",
        "elements": [
            {
              "type": "matrix",
              "name": "quality",
              "title": "Please indicate if you agree or disagree with the following statements",
              "columns": [{
                "value": 5,
                "text": "Strongly agree"
              }, {
                "value": 4,
                "text": "Agree"
              }, {
                "value": 3,
                "text": "Neutral"
              }, {
                "value": 2,
                "text": "Disagree"
              }, {
                "value": 1,
                "text": "Strongly disagree"
              }],
              "rows": [
                {
                  "value": "Interacting with this decision support tool helped me to understand more about the tradeoffs in this problem",
                  "text": "Interacting with this decision support tool helped me to understand more about the tradeoffs in this problem"
                },
                {
                  "value": "A lot of mental activity (e.g., thinking, deciding, and remembering) was required to find my final solution",
                  "text": "A lot of mental activity (e.g., thinking, deciding, and remembering) was required to find my final solution"
                },
                {
                  "value": "The process of finding the final solution was difficult.",
                  "text": "The process of finding the final solution was difficult."
                },
                {
                    "value": "It was easy to learn to use this decision support tool.",
                    "text": "It was easy to learn to use this decision support tool."
                },
                {
                    "value": "I felt I was in control during the solution process.",
                    "text": "I felt I was in control during the solution process."
                },
                {
                    "value": "I felt comfortable using this decision support tool.",
                    "text": "I felt comfortable using this decision support tool."
                },
              ],
              "alternateRows": true,
              "isAllRowRequired": true
            }, {
                "name": "expectations3",
                "type": "text",
                "title": "What did you find new or unexpected compared to what you knew or expected before starting the solution process? Please specify.",
                "isRequired": true,
            }
        ]
      },{
        "title": "A GENERAL QUESTION HERE",
        "elements": [
            {
              "type": "matrix",
              "name": "quality",
              "title": "Please indicate if you agree or disagree with the following statements",
              "columns": [{
                "value": 5,
                "text": "Strongly agree"
              }, {
                "value": 4,
                "text": "Agree"
              }, {
                "value": 3,
                "text": "Neutral"
              }, {
                "value": 2,
                "text": "Disagree"
              }, {
                "value": 1,
                "text": "Strongly disagree"
              }],
              "rows": [
                {
                  "value": "Overall, I am satisfied with the ease of completing this task.",
                  "text": "Overall, I am satisfied with the ease of completing this task."
                },
                {
                  "value": " Overall, I am satisfied with the amount of time it took to complete this task.",
                  "text": " Overall, I am satisfied with the amount of time it took to complete this task."
                },
                {
                  "value": "I felt frustrated in the solution process (e.g., insecure, discouraged, irritated, stressed)",
                  "text": "I felt frustrated in the solution process (e.g., insecure, discouraged, irritated, stressed)"
                },
              ],
              "alternateRows": true,
              "isAllRowRequired": true
            }, {
                "name": "expectations4",
                "type": "text",
                "title": "Please, explain why or why not.",
                "isRequired": true,
            }
        ]
      },
    ]
  };


  export const switchquestionnaire = {
    "pages": [
      {
        "title": "A GENERAL QUESTION HERE",
        "elements": [
            {
              "type": "matrix",
              "name": "quality",
              "title": "Please indicate if you agree or disagree with the following statements",
              "columns": [{
                "value": 5,
                "text": "Strongly agree"
              }, {
                "value": 4,
                "text": "Agree"
              }, {
                "value": 3,
                "text": "Neutral"
              }, {
                "value": 2,
                "text": "Disagree"
              }, {
                "value": 1,
                "text": "Strongly disagree"
              }],
              "rows": [
                {
                  "value": "Phase 1 enabled exploring solutions with different conflicting values of the objective functions.",
                  "text": "Phase 1 enabled exploring solutions with different conflicting values of the objective functions."
                },
                {
                  "value": "Phase 1 enabled me to learn about the conflict degrees among the objectives.",
                  "text": "Phase 1 enabled me to learn about the conflict degrees among the objectives."
                },
                {
                  "value": "Phase 1 enabled me to direct the search toward  a set of interesting solutions.",
                  "text": "Phase 1 enabled me to direct the search toward  a set of interesting solutions."
                },
                {
                    "value": "Phase 1 played an important role in fine-tuning the final solution.",
                    "text": "Phase 1 played an important role in fine-tuning the final solution."
                },
              ],
              "alternateRows": true,
              "isAllRowRequired": true
            }, {
                "name": "Do you have other comments about Phase 1? If so, please specify.",
                "type": "text",
                "title": "Do you have other comments about Phase 1? If so, please specify.",
            }
          ],
          "showQuestionNumbers": "off"
      },{
        "title": "A GENERAL QUESTION HERE",
        "elements": [
            {
              "type": "matrix",
              "name": "quality",
              "title": "Please indicate if you agree or disagree with the following statements",
              "columns": [{
                "value": 5,
                "text": "Strongly agree"
              }, {
                "value": 4,
                "text": "Agree"
              }, {
                "value": 3,
                "text": "Neutral"
              }, {
                "value": 2,
                "text": "Disagree"
              }, {
                "value": 1,
                "text": "Strongly disagree"
              }],
              "rows": [
                {
                  "value": "Phase 2 enabled exploring solutions with different conflicting values of the objective functions.",
                  "text": "Phase 2 enabled exploring solutions with different conflicting values of the objective functions."
                },
                {
                  "value": "Phase 2 enabled me to learn about the conflict degrees among the objectives.",
                  "text": "Phase 2 enabled me to learn about the conflict degrees among the objectives."
                },
                {
                  "value": "Phase 2 enabled me to direct the search toward  a set of interesting solutions.",
                  "text": "Phase 2 enabled me to direct the search toward  a set of interesting solutions."
                },
                {
                    "value": "Phase 2 played an important role in fine-tuning the final solution.",
                    "text": "Phase 2 played an important role in fine-tuning the final solution."
                },
                {
                    "value": "Phase 2 increased my confidence in the final solution.",
                    "text": "Phase 2 increased my confidence in the final solution."
                },
              ],
              "alternateRows": true,
              "isAllRowRequired": true
            }, {
                "name": "Do you have other comments about Phase 2? If so, please specify.",
                "type": "text",
                "title": "Do you have other comments about Phase 2? If so, please specify.",
            }
        ]
      },{
        "title": "A GENERAL QUESTION HERE",
        "elements": [
            {
              "type": "matrix",
              "name": "quality",
              "title": "Please indicate if you agree or disagree with the following statements",
              "columns": [{
                "value": 5,
                "text": "Strongly agree"
              }, {
                "value": 4,
                "text": "Agree"
              }, {
                "value": 3,
                "text": "Neutral"
              }, {
                "value": 2,
                "text": "Disagree"
              }, {
                "value": 1,
                "text": "Strongly disagree"
              }],
              "rows": [
                {
                  "value": "Using the two phases supported me in finding the final solution.",
                  "text": "Using the two phases supported me in finding the final solution."
                },
                {
                  "value": "The types of preference information required in the  two phases were different. Switching between these types of preference information was easy.",
                  "text": "The types of preference information required in the  two phases were different. Switching between these types of preference information was easy."
                },
                {
                  "value": "I feel that the final solution is better than the one obtained at the end of Phase 1.",
                  "text": "I feel that the final solution is better than the one obtained at the end of Phase 1."
                },
                {
                    "value": "I feel that Phase 1 made it easier to find a good solution at the end of the solution process.",
                    "text": "I feel that Phase 1 made it easier to find a good solution at the end of the solution process."
                },
              ],
              "alternateRows": true,
              "isAllRowRequired": true
            },
        ]
      },
    ]
  };