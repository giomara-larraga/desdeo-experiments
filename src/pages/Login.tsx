import React from "react";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tokens } from "../types/AppTypes";
import { Form, Container, Row, Col } from "react-bootstrap";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
  setproblemGroup,
}: {
  apiUrl: string;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setLoggedAs: React.Dispatch<React.SetStateAction<string>>;
  setTokens: React.Dispatch<React.SetStateAction<Tokens>>;
  setGroupId: React.Dispatch<React.SetStateAction<number>>;
  setproblemGroup: React.Dispatch<React.SetStateAction<number>>;
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
        setproblemGroup(body.problemGroup);
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
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        //name="username"
        autoComplete="username"
        autoFocus
        {...register("username", {
          required: { value: true, message: "Username is required." },
        })}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        //name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        {...register("password", {
          required: { value: true, message: "Password is required." },
        })}
        //isInvalid={errors.username !== undefined}
        //helperText={`${errors.password.message}`}
      />

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Sign In
      </Button>
      {/*       <Form.Group className="mb-3" controlId="formBasicUsername">
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
      </Button> */}
    </Box>
  );
};

export default Login;
