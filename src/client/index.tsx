/// <reference path="../types/styled.d.ts" />

import { AppContainer } from "react-hot-loader";
import React from "react";
import ReactDOM from "react-dom";
import {
  ThemeProvider,
  createGlobalStyle,
  DefaultTheme,
} from "styled-components";

import App from "./App";

const Theme: DefaultTheme = {
  colors: {
    main: "#ece6ef",
    general: "#0D0C31",
    important: "#eb5160",
  },
};

const GlobalStyles = createGlobalStyle`
body {
  margin: 0;
  overflow: hidden;
  padding: 1em 2em 0em;
  color: ${(props) => props.theme.colors.general};
  background: ${(props) => props.theme.colors.main};
  font-family: Open Sans, Helvetica, Sans-Serif;
}
`;

function render(Root: typeof App) {
  ReactDOM.render(
    <AppContainer>
      <ThemeProvider theme={Theme}>
        <Root />
        <GlobalStyles />
      </ThemeProvider>
    </AppContainer>,
    document.getElementById("app")
  );
}

render(App);

type HotModule = NodeModule & { 
  hot: {
    accept: (path?: string, callback?: () => void) => void 
  } 
}

if((module as HotModule).hot) {
  (module as HotModule).hot.accept();
}
