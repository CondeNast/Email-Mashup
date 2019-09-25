import React from "react";
import { Tile, QdtComponent } from "dash-component-library/components";
import { withStyles } from "@material-ui/styles";

const styles = {
  tileContainer: {
    margin: "20px"
  },
  row: {
    display: "flex",
    flexDirection: "row",
    margin: "0px 0px 25px 20px"
  },
  fullRowItem: {
    flex: 2,
    //border: "1px solid black",
    //height: "500px",
    marginRight: "20px"
  },
  rowItem: {
    flex: 1,
    //border: "1px solid black",
    //height: "500px",
    marginRight: "20px"
  }
};

const EmailMultipleCharts = ({ classes, data, title,type }) => {
  return (
    <div className={classes.tileContainer}>
      <Tile title={title}>
        <div className={classes.row}>
          <div className={type === "revenue"? classes.rowItem : classes.fullRowItem}>
            <QdtComponent
                  type="QdtViz"
                  app={"KPI Performance"}
                  qdtProps={{
                    id: data.chartId1,
                    height: "400px"
                  }}
                ></QdtComponent>
          </div>
          <div className={type === "revenue"? classes.fullRowItem : classes.rowItem}>
            <QdtComponent
                  type="QdtViz"
                  app={"KPI Performance"}
                  qdtProps={{
                    id: data.chartId2,
                    height: "400px"
                  }}
                ></QdtComponent>
          </div>
        </div>

        {data.chartId3.map(d => {
          return (
            <div className={classes.row}>
              <div className={classes.fullRowItem}>
                <QdtComponent
                type="QdtViz"
                app={"KPI Performance"}
                qdtProps={{
                  id: d,
                  height: "400px"
                }}
              ></QdtComponent>
              </div>
            </div>
          );
        })}
      </Tile>
    </div>
  );
};

export default withStyles(styles)(EmailMultipleCharts);
