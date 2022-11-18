import React, { useState } from 'react';
import logo from './logo.svg';
import Sidebar from './components/Sidebar'
//import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import Product from './pages/Product';
import Analytics from './pages/Analytics';
import Comment from './pages/Comment';
import LayoutExperiment from './pages/LayoutExperiment';
import FirstQuestionnaire from './pages/FirstQuestionnaire';
import { Tokens } from "./types/AppTypes";
import NautilusNavigatorMethod from "./pages/NautilusNavigatorMethod"

import './style/custom.scss'
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
function App() {
  const [isLoggedIn, SetIsLoggedIn] = useState<boolean>(false);
  const [loggedAs, SetLoggedAs] = useState<string>("");
  const [methodCreated, SetMethodCreated] = useState<boolean>(false);
  const [activeProblemId, SetActiveProblemId] = useState<number | null>(2);
  const [tokens, SetTokens] = useState<Tokens>({ access: "", refresh: "" });
  const [chosenMethod, SetChosenMethod] = useState("");
  const [currentPage, setCurrentPage] = useState("");

  const API_URL: string = "http://127.0.0.1:5000";
  
  return (
    <>
    {/* This is the alias of BrowserRouter i.e. Router */}
    <Router>
    <Routes>
      <Route path="/" element={<LandingPage />}>
        <Route index element={
          <Login
            apiUrl={API_URL}
            setIsLoggedIn={SetIsLoggedIn}
            setLoggedAs={SetLoggedAs}
            setTokens={SetTokens}
          />
        } />
        <Route path="/register" element={
          <Register
            apiUrl={API_URL}
          />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
            <Route element={<LayoutExperiment 
              apiUrl={API_URL}
              isLoggedIn={isLoggedIn}
              loggedAs={loggedAs}
              tokens={tokens}
              currentPage={currentPage}
          />}>
          <Route path="/home" element={<Dashboard setCurrentPage={setCurrentPage}/>}/> 
          <Route path="/prequestionnaire" element={<FirstQuestionnaire setCurrentPage={setCurrentPage} isLoggedIn={isLoggedIn} loggedAs={loggedAs} tokens={tokens} apiUrl={API_URL}/>}/>
          <Route path="/nautilus" element={<NautilusNavigatorMethod 
          apiUrl={API_URL}
          isLoggedIn={isLoggedIn}
          loggedAs={loggedAs}
          tokens={tokens}
          activeProblemId={activeProblemId}
          setCurrentPage={setCurrentPage}
          />}/>
          <Route path="/comment" element={<Comment />}/> 
          <Route path="/analytics" element={<Analytics />}/> 
          <Route path="/product" element={<Product />}/> 
          <Route path="/productlist" element={<ProductList />}/> 
      </Route>
      {/* <Route path="/" element={<LandingPage />} /> */}
    </Routes>
  </Router>
</>
  );
}

export default App;
