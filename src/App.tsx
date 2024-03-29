import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import Sidebar from "./components/Sidebar";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LayoutExperiment from "./pages/LayoutExperiment";
import DemographicQuestionnaire from "./pages/DemographicQuestionnaire";
import FirstQuestionnaire from "./pages/FirstQuestionnaire";
import LastQuestionnaire from "./pages/LastQuestionnaire";
import SwitchQuestionnaire from "./pages/SwitchQuestionnaire";
import { Tokens } from "./types/AppTypes";
import NautilusNavigatorMethod from "./pages/NautilusNavigatorMethod";

import "./style/custom.scss";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import NimbusMethod from "./pages/nimbus/NimbusMethod";
import Thanks from "./pages/Thanks";
import LayoutMethod from "./pages/LayoutMethod";

//import LastQuestionnaire from './pages/LastQuestionnaire';
function App() {
  const [isLoggedIn, SetIsLoggedIn] = useState<boolean>(false);
  const [loggedAs, SetLoggedAs] = useState<string>("");
  const [groupId, SetGroupId] = useState<number>(-1);
  const [problemGroup, SetproblemGroup] = useState<number>(-1);
  //const [methodCreated, SetMethodCreated] = useState<boolean>(false);
  const [activeProblemId, SetActiveProblemId] = useState<number | null>(2);
  const [tokens, SetTokens] = useState<Tokens>({ access: "", refresh: "" });
  //const [chosenMethod, SetChosenMethod] = useState("");
  const [currentPage, setCurrentPage] = useState("");

  const API_URL: string = "https://moggroup.pythonanywhere.com";
  //const API_URL: string = "http://127.0.0.1:5000";

  // useEffect(() => {
  //   if (groupId === -1) {
  //     return;
  //   }
  //   if (groupId === 1) {

  //     return;
  //   }
  //   if (groupId === 2) {
  //     return;
  //   }
  // }, [groupId, problemGroup]);

  return (
    <>
      {/* This is the alias of BrowserRouter i.e. Router */}
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />}>
            <Route
              index
              element={
                <Login
                  apiUrl={API_URL}
                  setIsLoggedIn={SetIsLoggedIn}
                  setLoggedAs={SetLoggedAs}
                  setTokens={SetTokens}
                  setGroupId={SetGroupId}
                  setproblemGroup={SetproblemGroup}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          <Route
            element={
              <LayoutExperiment
                apiUrl={API_URL}
                isLoggedIn={isLoggedIn}
                loggedAs={loggedAs}
                tokens={tokens}
                groupId={groupId}
                currentPage={currentPage}
              />
            }
          >
            <Route
              path="/home"
              element={
                <Dashboard
                  isLoggedIn={isLoggedIn}
                  loggedAs={loggedAs}
                  tokens={tokens}
                  apiUrl={API_URL}
                  groupId={groupId}
                  problemGroup={problemGroup}
                />
              }
            />
            <Route
              path="/demographic"
              element={
                <DemographicQuestionnaire
                  setCurrentPage={setCurrentPage}
                  isLoggedIn={isLoggedIn}
                  loggedAs={loggedAs}
                  tokens={tokens}
                  apiUrl={API_URL}
                  groupId={groupId}
                  problemGroup={problemGroup}
                />
              }
            />
            <Route
              path="/prequestionnaire"
              element={
                <FirstQuestionnaire
                  setCurrentPage={setCurrentPage}
                  isLoggedIn={isLoggedIn}
                  loggedAs={loggedAs}
                  tokens={tokens}
                  apiUrl={API_URL}
                  groupId={groupId}
                  problemGroup={problemGroup}
                />
              }
            />
            <Route
              path="/postquestionnaire"
              element={
                <LastQuestionnaire
                  setCurrentPage={setCurrentPage}
                  isLoggedIn={isLoggedIn}
                  loggedAs={loggedAs}
                  tokens={tokens}
                  apiUrl={API_URL}
                  groupId={groupId}
                />
              }
            />
            <Route
              path="/switchquestionnaire"
              element={
                <SwitchQuestionnaire
                  setCurrentPage={setCurrentPage}
                  isLoggedIn={isLoggedIn}
                  loggedAs={loggedAs}
                  tokens={tokens}
                  apiUrl={API_URL}
                  groupId={groupId}
                />
              }
            />

            <Route
              path="/nautilus"
              element={
                <NautilusNavigatorMethod
                  apiUrl={API_URL}
                  isLoggedIn={isLoggedIn}
                  loggedAs={loggedAs}
                  tokens={tokens}
                  problemGroup={problemGroup}
                  setCurrentPage={setCurrentPage}
                />
              }
            />

            <Route
              path="/thanks"
              element={
                <Thanks
                  apiUrl={API_URL}
                  isLoggedIn={isLoggedIn}
                  loggedAs={loggedAs}
                  tokens={tokens}
                  groupId={groupId}
                  setCurrentPage={setCurrentPage}
                />
              }
            />
          </Route>
          <Route
            element={
              <LayoutMethod
                apiUrl={API_URL}
                isLoggedIn={isLoggedIn}
                loggedAs={loggedAs}
                tokens={tokens}
                groupId={groupId}
                currentPage={currentPage}
              />
            }
          >
            <Route
              path="/nimbus"
              element={
                <NimbusMethod
                  apiUrl={API_URL}
                  isLoggedIn={isLoggedIn}
                  loggedAs={loggedAs}
                  tokens={tokens}
                  groupId={groupId}
                  problemGroup={problemGroup}
                  setCurrentPage={setCurrentPage}
                />
              }
            />
          </Route>
          {/* <Route path="/" element={<LandingPage />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
