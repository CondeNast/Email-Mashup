import React from "react";
import { Tile, QdtComponent } from "dash-component-library/components";
import { withStyles } from "@material-ui/styles";

const styles = {
  tileContainer: {
    margin: "20px"
  },
  row: {
    display: "flex",
    flexDirection: "column",
    margin: "0px 20px 25px"
  },
  fullRowItem: {
    flex: 2
  }
};

const EmailDualCharts = ({ classes, data, title, downloadIds }) => {
  //returning tiles with two charts
  return (
    <div className={classes.tileContainer}>
      <Tile title={title} downloadIds={downloadIds}>
        {data.map((d, i) => {
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

export default withStyles(styles)(EmailDualCharts);
