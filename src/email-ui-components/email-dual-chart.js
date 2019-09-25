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
        margin: "0px 20px 25px",
        //border:"1px solid black",
        //height:"500px"
      },
      fullRowItem: {
        flex: 2
      }
};

const EmailDualCharts = ({ classes, data, title }) => {
  return (
    <div className={classes.tileContainer}>
      <Tile title={title}>
          {data.map(d => {
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

export default withStyles(styles)(EmailDualCharts);
