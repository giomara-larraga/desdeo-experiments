import React from "react";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tokens } from "../types/AppTypes";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

interface FormData {
  username: string;
  password: string;
}

export const Login = ({
  apiUrl,
  setIsLoggedIn,
  setLoggedAs,
  setTokens,
  setGroupId,
}: {
  apiUrl: string;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setLoggedAs: React.Dispatch<React.SetStateAction<string>>;
  setTokens: React.Dispatch<React.SetStateAction<Tokens>>;
  setGroupId: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [loginOk, SetLoginOk] = useState<boolean>(false);
  const navigate = useNavigate();
  const [errorMessage, SetErrorMessage] = useState<string>("");

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status == 200) {
        // Status is ok
        setLoggedAs(data.username);
        setIsLoggedIn(true);
        SetLoginOk(true);

        const body = await res.json();
        setTokens({ access: body.access_token, refresh: body.refresh_token });
        setGroupId(body.group_id);
        SetErrorMessage("");
        navigate("/home");
      } else {
        SetLoginOk(false);
        SetErrorMessage("Invalid username or password");
      }
    } catch (e) {
      console.log(e);
      // Do nothing
    }
  };

  return (
    <Form
      className="user"
      action=""
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="on"
    >
      <Form.Group className="mb-3" controlId="formBasicUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="username"
          placeholder="Username"
          {...register("username", {
            required: { value: true, message: "Username is required." },
          })}
          isInvalid={errors.username !== undefined}
        />
        {errors.username && (
          <Form.Control.Feedback type="invalid">{`${errors.username.message}`}</Form.Control.Feedback>
        )}
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          {...register("password", {
            required: { value: true, message: "Password is required." },
          })}
          isInvalid={errors.password !== undefined}
        />
        {errors.password && (
          <Form.Control.Feedback type="invalid">{`${errors.password.message}`}</Form.Control.Feedback>
        )}
      </Form.Group>
      {!loginOk && <p className="text-error">{`${errorMessage}`}</p>}
      <Button
        className="w-100"
        variant="primary"
        style={{ color: "white" }}
        type="submit"
      >
        Login
      </Button>
    </Form>
  );
};

export default Login;
