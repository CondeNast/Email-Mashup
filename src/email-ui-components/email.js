import React from "react";
import { qlikConfig } from "../config";
import { Tile, QdtComponent } from "dash-component-library/components";
import { withStyles } from "@material-ui/styles";

const styles = {
    row: {
        display: "flex",
        flexDirection: "row",
        marginBottom: "25px"
      },
      rowItem:{
        flex:1
      },
};
const timeData = ["WKCG", "VDYAVG", "PJZNFHY", "ABCCRQJ", "PXSYT"];
const title={ 
              summary: "EMAIL SUMMARY",
              news: "NEWSLETTER LIST SIZE", 
              subscriptions: "SUBSCRIPTIONS", 
              engagement: "ENGAGEMENT", 
              revenue: "REVENUE YTD", 
              traffic: "TRAFFIC"
        }
const Email = ({ classes }) => {
  return (
    <div className={classes.emailContainer}>
        <div className={classes.summaryTileContainer}>
        <Tile title={title.summary}>
      <div className={classes.row}>
        {timeData.map(d => {
          return (
            <div className={classes.rowItem}>
              <QdtComponent
                type="QdtViz"
                app={"KPI Performance"}
                qdtProps={{
                  id: d,
                  height: "100px"
                }}
              ></QdtComponent>
            </div>
          );
        })}
      </div>
      </Tile>
      </div>
    </div>
  );
};

export default withStyles(styles)(Email);
