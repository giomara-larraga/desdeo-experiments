import React from "react";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { resolveTypeReferenceDirective } from "typescript";
function Likert(){
    const responses = [
        { value: 1, text: "Strongly disagree" },
        { value: 2, text: "Disagree" },
        { value: 3, text: "Somewhat disagree" },
        { value: 4, text: "Neutral" },
        { value: 5, text: "Somewhat agree" },
        { value: 6, text: "Agree" },
        { value: 7, text: "Strongly agree" }
    ]
    return (
            <div key={`inline-radio`} className="mb-3">     
            {
                responses.map((response)=>(
                    <Form.Check
                        inline
                        label={response.text}
                        name="group1"
                        type="radio"
                        id={`inline-radio-1`}
                    />
                ))   
            }
            </div>
    )
}
export default Likert;