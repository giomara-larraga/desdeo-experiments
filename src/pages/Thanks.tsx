import React from "react";
import { useEffect, useState, useCallback } from "react";
import { Tokens } from "../types/AppTypes";
import { Container, Row, Col, Button, Form, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

interface ThanksProps {
  isLoggedIn: boolean;
  loggedAs: string;
  tokens: Tokens;
  apiUrl: string;
  groupId: number;
}
function Thanks({
  isLoggedIn,
  loggedAs,
  tokens,
  apiUrl,
  groupId,
}: //activeProblemId,
ThanksProps) {
  return <Container>Thank you. I dont need you anymore. Bye.</Container>;
}

export default Thanks;
