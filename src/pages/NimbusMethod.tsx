import React from "react";
import { useEffect, useState, useCallback } from "react";
import {
  ProblemInfo,
  ObjectiveData,
  ObjectiveDatum,
} from "../types/ProblemTypes";
import { Tokens } from "../types/AppTypes";
import ClassificationsInputForm from "../components/ClassificationsInputForm";
import { Container, Row, Col, Button, Form, Table } from "react-bootstrap";
import ReactLoading from "react-loading";
import { ParseSolutions, ToTrueValues } from "../utils/DataHandling";
import { ParallelAxes } from "desdeo-components";
import HorizontalBars from "../components/HorizontalBars";
import SolutionTable from "../components/SolutionTable";
import SolutionTableMultiSelect from "../components/SolutionTableMultiSelect";
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
