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
    marginRight: "20px"
  },
  fullRowItem: {
    flex: 2
  }
};
const timeData = ["cUhxAW", "FdueQs", "dMzNwdC", "LzMmPve", "PtugDN"];
const newsData = "XCYtj";
const subscriptionData = ["RpNskFZ", "cJFjMjN"];
const engagementData = ["JwPMwn", "BLMkPQn"];

const revenueData = {
  chartId1: "RUMhhFk",
  chartId2: "PeKKS",
  chartIdArray: ["zexksT"]
};
const trafficData = {
  chartId1: "ezpwKU",
  chartId2: "eJZJe",
  chartIdArray: ["amGPVAj", "prhbYm"]
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
            {timeData.map((d, i) => {
              return (
                <div className={classes.rowItem} key={i}>
                  <QdtComponent
                    type='QdtViz'
                    app={"Email Mashup"}
                    qdtProps={{
                      id: d,
                      height: "150px"
                    }}
                  ></QdtComponent>
                </div>
              );
            })}
          </div>
        </Tile>
      </div>

      {/* Newsletter Tile */}
      <div className={classes.tileContainer}>
        <Tile title={title.news}>
          <div className={classes.row}>
            <div className={classes.fullRowItem}>
              <QdtComponent
                type='QdtViz'
                app={"Email Mashup"}
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
      <EmailMultipleChart
        data={revenueData}
        title={title.revenue}
        type='revenue'
      />
      <EmailMultipleChart data={trafficData} title={title.traffic} />
    </div>
  );
};

export default withStyles(styles)(Email);
