import React, { useState, useEffect } from "react";
import { useSession } from "dash-component-library/context";
import { invalidations } from "rxq";
import { map } from "rxjs/operators";
import { qAskReplayRetry } from "dash-component-library/operators";
import {
  Button,
  BrandSelector,
  ClearButton,
  AnalystButton,
  Dropdown,
  QdtComponent,
  CurrentSelections
} from "dash-component-library/components";
import withStyles from "react-jss";
import classNames from "classnames";
import dropdown from "../resources/images/dropdown.png";
import { useSelectFieldValues } from "dash-component-library/hooks";

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

const defaultDateRange = () => {
  var jan1990 = new Date(1899, 11, 30);
  var today = new Date();
  var difference = (today - jan1990) / 86400000;
  var formattedDate = Math.floor(difference);
  formattedDate = Number(formattedDate);
  let dateArray = [];
  for (let i = 1; i <= 14; i++) {
    dateArray.push(formattedDate - i);
  }

  return dateArray;
};

const DropdownButton = withStyles(styles)(
  ({ classes, children, ...dropdownButtonProps }) => {
    return (
      <Button
        className={classes.dropdownButton}
        Icon={<img className="dropdown-icon" src={dropdown} alt="drop-down" />}
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

  const { select: select_date } = useSelectFieldValues({
    field: "Date"
  });

  const { select: select_mailing_status } = useSelectFieldValues({
    field: "mailing_status"
  });

  const [dataAsOfDate, setDataAsOfDate] = useState(null);
  useEffect(() => {
    const sub$ = doc$
      .pipe(
        qAskReplayRetry("CreateSessionObject", {
          qInfo: { qType: "kpi" },
          date: {
            qStringExpression: `=Date($(asofdate))`
          }
        }),
        invalidations(true),
        qAskReplayRetry("GetLayout"),
        map(layout => layout.date)
      )
      .subscribe(setDataAsOfDate);

    select_date(defaultDateRange());

    return () => sub$.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [currentBrandSelection, setCurrentBrandSelection] = useState(null);

  const onClear = () => {
    select_date(defaultDateRange());
    select_mailing_status(["All Mailings"]);
  };

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
          field="Brand"
          setSelectedBrand={setCurrentBrandSelection}
          fieldMap={{
            Allure: "ALL",
            "Architectural Digest": "AD",
            "Ars Technica": "ARST",
            "Bon Appetit": "BA",
            Brides: "BRDE",
            "CN Traveler": "CNT",
            Epicurious: "EPIC",
            Glamour: "GLAM",
            "Golf Digest": "GFDG",
            GQ: "GQ",
            Pitchfork: "PTFK",
            Self: "SELF",
            "Teen Vogue": "VOGT",
            "The New Yorker": "TNY",
            "Vanity Fair": "VF",
            Vogue: "VOG",
            "W Magazine": "W",
            Wired: "WIRE"
          }}
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
              id: "EHeTqgC",
              width: "600px",
              height: "300px"
            }}
          />
        </div>
      </Dropdown>
      <CurrentSelections></CurrentSelections>
      <ClearButton onClear={() => onClear()} />
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
