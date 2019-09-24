import React from "react";
import { Tile, QdtComponent } from "dash-component-library/components";
import { withStyles } from "@material-ui/styles";

const styles = {
    tileContainer:{
        margin:"20px"
    },
    row: {
        display: "flex",
        flexDirection: "row",
        marginBottom: "25px"
      },
      fullRowItem: {
        flex: 2
      },
      rowItem: {
        flex: 1
      }
};

const EmailMultipleCharts = ({ classes, data, title }) => {
  return (
    <div className={classes.tileContainer}>
      <Tile title={title}>
        <div className={classes.row}>
              <div className={classes.rowItem}>
                <QdtComponent
                  type="QdtViz"
                  app={"KPI Performance"}
                  qdtProps={{
                    id: data.chartId1,
                    height: "400px"
                  }}
                ></QdtComponent>
              </div>
              <div className={classes.fullRowItem}>
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

        
          {data.chartId3.map(d=>{
            return(
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
            )
          })}

            );
          })}
       
      </Tile>
    </div>
  );
};

export default withStyles(styles)(EmailMultipleCharts);
