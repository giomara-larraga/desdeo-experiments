import { Button, Container, Col, Form, FormControl, Row } from "react-bootstrap";
import { Link , useNavigate} from "react-router-dom";
import { appendErrors, useForm } from "react-hook-form";
import { formatDiagnosticsWithColorAndContext } from "typescript";
import { useState } from "react";

interface FormData {
  username: string;
  password: string;
  passwordConfirm: string;
}

function Register({ apiUrl }: { apiUrl: string }) {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<FormData>({ mode: "all" });
  const [registered, SetRegistered] = useState<boolean>(false);
  const [badUsername, SetBadUsername] = useState<boolean>(false);
  const [errorMessage, SetErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    const credentials = { username: data.username, password: data.password }
    try {
      const res = await fetch(`${apiUrl}/registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (res.status == 200) {
        // OK
        SetRegistered(true);
        SetBadUsername(false);
        SetErrorMessage("User registered succesfully! Login to continue");
      }

      else if (res.status == 400) {
        // Username invalid or taken
        // try another one
        const body = await res.json();
        SetErrorMessage(body.message);
        SetBadUsername(true);
      }
    } catch (e) {
      console.log(e);
      // Do nothing
    }
  };

  return (
    <div className='p-5'>
      <div className='text-center'>
        <h4 className='text-dark mb-4'>Create an Account</h4>
      </div>
      <Form className='user' onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control 
            type="username"
            placeholder="Enter username"
            {...register("username",{required:true})}
            isInvalid={errors.username !== undefined}
           />
           {errors.username &&
                <Form.Control.Feedback type="invalid">{`${errors.username.message}`}</Form.Control.Feedback>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control 
          type="password"
          placeholder="Password"
          {...register("password", { required: { value: true, message: "Password required." }, validate: value => value.length > 5 || "Password too short. Password must be at least 6 characters long." })}
          isInvalid={errors.password !== undefined}
          />
          {errors.password &&
                <Form.Control.Feedback type="invalid">{`${errors.password.message}`}</Form.Control.Feedback>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formRepeatPassword">
          <Form.Label>Repeat Password</Form.Label>
          <Form.Control 
            type="password"
            placeholder="Confirm password"
            {...register("passwordConfirm",{ required: { value: true, message: "Password confirmation required." }, validate: value => value === getValues("password") || "Passwords do not match!" })}
            isInvalid={errors.passwordConfirm !== undefined} />
            {errors.passwordConfirm &&
                  <Form.Control.Feedback type="invalid">{`${errors.passwordConfirm.message}`}</Form.Control.Feedback>}
        </Form.Group>
        {badUsername && <p className="text-danger">{`${errorMessage}`}</p>}
        {registered && !badUsername && <p className="text-info">{`${errorMessage}`}</p>}
        <Button  className="w-100" variant="primary" style={{color:'white'}} type="submit">
          Sign Up
        </Button>
        <hr />
      </Form>
      <Link to="/">
        <div className='text-link'>
          <a style={{cursor:'pointer'}}>Already have an account? Login</a>
        </div>
      </Link>

    </div>
  );
}

export default Register;
