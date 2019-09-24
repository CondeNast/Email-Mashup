import React from "react";
import { SessionProvider } from "dash-component-library/context";
import { qlikConfig } from "./config";
import { Sheet } from "./sheets";
import withStyles from "react-jss";

const styles = {
  app: {
    padding: "0 10% 138px",
    fontFamily: `"Rubik", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif`,
    "& .period-dropdown__calendar .vizlib-calendar__calendar-controls": {
      backgroundColor: "transparent !important",
      border: "none !important"
    }
  }
};

function App({ classes }) {
  return (
    <div className={classes.app}>
      <SessionProvider qlikConfig={qlikConfig}>
        <Sheet />
      </SessionProvider>
    </div>
  );
}

export default withStyles(styles)(App);
