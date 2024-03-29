import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
//import { ThemeOptions } from "@mui/material/styles";
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material";

//import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";

export const themeOptions = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0d47a1",
    },
    secondary: {
      main: "#26c6da",
    },
  },
  typography: {
    h1: {
      fontFamily: "Calibri",
    },
    h2: {
      fontFamily: "Calibri",
    },
    h3: {
      fontFamily: "Calibri",
    },
    h4: {
      fontFamily: "Calibri",
    },
    h5: {
      fontFamily: "Calibri",
    },
    h6: {
      fontFamily: "Calibri",
    },
    fontFamily: "Calibri",
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        dense: {
          height: 42,
          minHeight: 42,
          flexShrink: 0,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#D9D9D9",
          boxShadow: "none",
        },
      },
    },
  },
});
export const theme = responsiveFontSizes(themeOptions);
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
