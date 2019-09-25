import React from "react";
import { Tile, QdtComponent } from "dash-component-library/components";
import { withStyles } from "@material-ui/styles";
import EmailDualChart from "./email-dual-chart";
import EmailMultipleChart from "./email-multiple-chart";

const styles = {
  tileContainer: {
    margin: "20px"
  },
  row: {
    display: "flex",
    flexDirection: "row",
    margin: "0px 20px 25px"
  },
  rowItem: {
    flex: 1,
    //border:"1px solid black",
    //height:"250px",
    marginRight:"20px"
  },
  fullRowItem: {
    flex: 2,
    //border:"1px solid black",
  }
};
const timeData = ["WKCG", "VDYAVG", "PJZNFHY", "ABCCRQJ", "PXSYT"];
const newsData = "XCYTJ";
const subscriptionData = ["RPNSKFZ", "CJFJMJN"];
const engagementData = ["JWPMWN", "BLMKPQN"];

const revenueData = {
  chartId1: "RUMHHFK",
  chartId2: "PEKKS",
  chartId3: ["ZEXKST"]
};
const trafficData = {
  chartId1: "EZPWKU",
  chartId2: "EJZJE",
  chartId3: ["AMGPVAJ", "PRHBYM"]
};
const title = {
  summary: "EMAIL SUMMARY",
  news: "NEWSLETTER LIST SIZE",
  subscriptions: "SUBSCRIPTIONS",
  engagement: "ENGAGEMENT",
  revenue: "REVENUE YTD",
  traffic: "TRAFFIC"
};
const Email = ({ classes }) => {
  return (
    <div className={classes.emailContainer}>
      {/* Summary Tile */}
      <div className={classes.tileContainer}>
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

      {/* News Tile */}
      <div className={classes.tileContainer}>
        <Tile title={title.news}>
          <div className={classes.row}>
            <div className={classes.fullRowItem}>
              <QdtComponent
                type="QdtViz"
                app={"KPI Performance"}
                qdtProps={{
                  id: newsData,
                  height: "500px"
                }}
              ></QdtComponent>
            </div>
          </div>
        </Tile>
      </div>
      <EmailDualChart data={subscriptionData} title={title.subscriptions} />
      <EmailDualChart data={engagementData} title={title.engagement} />
      <EmailMultipleChart data={revenueData} title={title.revenue} type="revenue"/>
      <EmailMultipleChart data={trafficData} title={title.traffic} />
    </div>
  );
};

export default withStyles(styles)(Email);
