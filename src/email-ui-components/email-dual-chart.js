import React from "react";
import { Tile, QdtComponent } from "dash-component-library/components";
import { withStyles } from "@material-ui/styles";

const styles = {
    tileContainer:{
        margin:"20px"
    },
    row: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "25px"
      },
      fullRowItem: {
        flex: 2
      }
};

const EmailDualCharts = ({ classes, data, title }) => {
  return (
    <div className={classes.tileContainer}>
      <Tile title={title}>
        <div className={classes.row}>
          {data.map(d => {
            return (
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
            );
          })}
        </div>
      </Tile>
    </div>
  );
};

export default withStyles(styles)(EmailDualCharts);
