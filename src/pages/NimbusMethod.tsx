import React from "react";
import { useEffect, useState, useCallback } from "react";
import {
  ProblemInfo,
  ObjectiveData,
  ObjectiveDatum,
} from "../types/ProblemTypes";
import { Tokens } from "../types/AppTypes";
import { Container, Row, Col, Button, Form, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

interface NimbusMethodProps {
  isLoggedIn: boolean;
  loggedAs: string;
  tokens: Tokens;
  apiUrl: string;
  groupId: number;
}
function NimbusMethod({
  isLoggedIn,
  loggedAs,
  tokens,
  apiUrl,
  groupId,
}: //activeProblemId,
NimbusMethodProps) {
  return (
    <Container>
      Hello I am nimbus, use me.
      <Link to={"/postquestionnaire"}>
        <Button>{"Continue"}</Button>
      </Link>
    </Container>
  );
}

export default NimbusMethod;
