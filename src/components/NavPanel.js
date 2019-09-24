import React, { useState, useEffect } from "react";
import { useSession } from "dash-component-library/context";
import { qAskReplay, invalidations } from "rxq";
import { map } from "rxjs/operators";
import {
  Button,
  BrandSelector,
  ClearButton,
  AnalystButton,
  Dropdown,
  QdtComponent
} from "dash-component-library/components";
import withStyles from "react-jss";
import classNames from "classnames";
import dropdown from "../resources/images/dropdown.png";

const styles = {
  navPanel: {
    display: "flex",
    alignItems: "center",
    padding: "20px 0",
    width: "calc(100%)",
    "& .dropdown-icon": { width: "10px" }
  },
  navPanel__brandDropdown: { marginRight: "10px" },
  navPanel__periodDropdown: { marginRight: "10px" },
  navPanel__analystButton: { marginLeft: "auto" },
  navPanel__item: { marginRight: "35px" },
  dropdownButton: { "&:hover": { backgroundColor: "#212121" } },
  dropdown: { marginRight: "10px" },
  periodDropdown__container: {
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#343a40"
  }
};

const DropdownButton = withStyles(styles)(
  ({ classes, children, ...dropdownButtonProps }) => {
    return (
      <Button
        className={classes.dropdownButton}
        Icon={<img className="dropdown-icon" src={dropdown} />}
        {...dropdownButtonProps}
      >
        {children}
      </Button>
    );
  }
);

export default withStyles(styles)(({ classes }) => {
  const {
    app,
    rxq: { doc$ }
  } = useSession()[0];

  const [dataAsOfDate, setDataAsOfDate] = useState(null);
  useEffect(() => {
    const sub$ = doc$
      .pipe(
        qAskReplay("GetVariableByName", "vMaxDate"),
        invalidations(true),
        qAskReplay("GetLayout"),
        map(layout => layout.qText)
      )
      .subscribe(setDataAsOfDate);

    return () => sub$.unsubscribe();
  }, []);

  const [currentBrandSelection, setCurrentBrandSelection] = useState(null);

  return (
    <div className={classNames("nav-panel", classes.navPanel)}>
      <div className={classNames("nav-panel__item", classes.navPanel__item)}>
        Data as of
        <br />
        {dataAsOfDate}
      </div>
      <Dropdown
        DropdownButton={DropdownButton}
        dropdownButtonChildren={`Brand${
          currentBrandSelection !== null ? `: ${currentBrandSelection}` : ""
        }`}
        className={classes.dropdown}
      >
        <BrandSelector
          field="brand"
          setSelectedBrand={setCurrentBrandSelection}
        />
      </Dropdown>
      <Dropdown
        DropdownButton={DropdownButton}
        dropdownButtonChildren="Period"
        className={classes.dropdown}
      >
        <div
          className={classNames(
            "period-dropdown__calendar",
            classes.periodDropdown__container
          )}
        >
          <QdtComponent
            type="QdtViz"
            qdtProps={{
              type: "vizlib-calendar",
              id: "zfSE",
              width: "600px",
              height: "300px"
            }}
          />
        </div>
      </Dropdown>
      <ClearButton />
      <AnalystButton
        className={classNames(
          "nav-panel__analyst-button",
          classes.navPanel__analystButton
        )}
        url={`https://dash.condenast.com/sense/app/${app}`}
      />
    </div>
  );
});
