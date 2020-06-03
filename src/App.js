import React from "react";
import { SessionProvider } from "dash-component-library/context";
import { qlikConfig } from "./config";
import Email from "./email-ui-components/email";
import withStyles from "react-jss";
import { NavPanel } from "./components";
import { HashRouter as Router } from "react-router-dom";
import QueryFiltersComponent from "./Filters/querryFilters";

const prefix = window.location.pathname.substr(
  1,
  window.location.pathname.toLowerCase().lastIndexOf("/extensions") - 1
);

const qlikConfigWithPrefix = {
  ...qlikConfig,
  prefix
};

const styles = {
  app: {
    padding: "0 10% 138px",
    fontFamily: `"Rubik", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif`,
    backgroundColor: "#F2F2F2"
  }
};
const dateFormat = {
  Date: "M/D/YYYY"
};
function App({ classes }) {
  return (
    <div className={classes.app}>
      <SessionProvider qlikConfig={qlikConfigWithPrefix}>
        <Router>
          <QueryFiltersComponent
            maxFieldValues={100}
            listFields={[]}
            dateFormat={dateFormat}
          />
          <NavPanel prefix={prefix} />
          <Email />
        </Router>
      </SessionProvider>
    </div>
  );
}

export default withStyles(styles)(App);
