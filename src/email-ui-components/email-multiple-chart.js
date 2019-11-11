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

const EmailMultipleCharts = ({ classes, data, title, type, downloadIds, anchor }) => {
  //returning tiles with more than two charts
  return (
    <div className={classes.tileContainer}>
      <Tile title={title} downloadIds={downloadIds} anchor={anchor}>
        <div className={classes.row}>
          {/* Checking if it is of type revenue to assign particular class and handle spacing */}
          <div
            className={
              type === "revenue" ? classes.rowItem : classes.fullRowItem
            }
          >
            <QdtComponent
              type='QdtViz'
              app={"Email Mashup"}
              qdtProps={{
                id: data.chartId1,
                height: "400px"
              }}
            ></QdtComponent>
          </div>
          {/* Checking if it is of type revenue to assign particular class and handle spacing */}
          <div
            className={
              type === "revenue" ? classes.fullRowItem : classes.rowItem
            }
          >
            <QdtComponent
              type='QdtViz'
              app={"Email Mashup"}
              qdtProps={{
                id: data.chartId2,
                height: "400px"
              }}
            ></QdtComponent>
          </div>
        </div>
        {/* returning the charts in chartIdArray */}
        {data.chartIdArray.map((d, i) => {
          return (
            <div className={classes.row} key={i}>
              <div className={classes.fullRowItem}>
                <QdtComponent
                  type='QdtViz'
                  app={"Email Mashup"}
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
