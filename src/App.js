import React from "react";
import { SessionProvider } from "dash-component-library/context";
import { qlikConfig } from "./config";
import Email from "./email-ui-components/email";
import withStyles from "react-jss";
import { NavPanel } from "./components";
import "./App.css";

const styles = {};

function App({ classes }) {
  return (
    <div className='App'>
      <SessionProvider qlikConfig={qlikConfig}>
        <NavPanel />
        <Email />
      </SessionProvider>
    </div>
  );
}

export default withStyles(styles)(App);
