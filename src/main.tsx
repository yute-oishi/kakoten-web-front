import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xssm: true;
    smmd: true;
  }
}

let theme = createTheme({
  typography: {
    fontFamily: "Noto Sans JP",
  },
  breakpoints: {
    values: {
      xs: 0,
      xssm: 500,
      sm: 600,
      smmd: 750,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </ThemeProvider>
);
