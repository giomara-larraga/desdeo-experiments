import { useEffect, useState, useRef } from "react";
import {
  ProblemInfo,
  ObjectiveData,
  NavigationData,
} from "../types/ProblemTypes";
import { Tokens } from "../types/AppTypes";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  ProgressBar,
} from "react-bootstrap";
import { Link } from "react-router-dom";

// TODO: should be imported, and need to update the NavigationData type in NavigationBars /types
// Test with 7 maximizable objectives.. only possible to test the drawing I guess..
//

interface NautilusNavigatorMethodProps {
  isLoggedIn: boolean;
  loggedAs: string;
  tokens: Tokens;
  apiUrl: string;
  groupId: number;
  //setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

function NautilusNavigatorMethod({
  isLoggedIn,
  loggedAs,
  tokens,
  apiUrl,
  groupId,
}: //setCurrentPage,
NautilusNavigatorMethodProps) {
  return (
    <Container fluid style={{ paddingRight: "0px", marginRight: "0px" }}>
      Hello I am Nautilus Navigator, use me.
      <Link to={"/nimbus"}>
        <Button>{"Continue"}</Button>
      </Link>
    </Container>
  );
}
export default NautilusNavigatorMethod;
