import React, { useEffect, useState } from "react";
import {
  Tile,
  QdtComponent,
  Navigator,
  Kpi
} from "dash-component-library/components";
import { withStyles } from "@material-ui/styles";
import EmailDualChart from "./email-dual-chart";
import EmailMultipleChart from "./email-multiple-chart";
import { format } from "d3";
import { qAskReplayRetry } from "dash-component-library/operators";
import { invalidations } from "rxq";
import { useSession } from "dash-component-library/context";

const styles = {
  tileContainer: {
    margin: "20px 0px"
  },
  row: {
    display: "flex",
    flexDirection: "row",
    margin: "0px 20px 25px"
  },
  kpiContainer: {
    display: "flex",
    justifyContent: "space-around"
  },
  kpiColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between"
  },
  kpiObject: {
    display: "flex",
    flexDirection: "column"
  },
  kpiValue: {
    fontSize: "55px"
  },
  kpiSub: {
    fontSize: "20px",
    color: "#4a4a4a"
  },
  kpiSource: {
    fontSize: "11px",
    textTransform: "uppercase",
    color: "#979797",
    fontWeight: 400,
    marginTop: "20px"
  },
  rowItem: {
    flex: 1,
    marginRight: "20px"
  },
  fullRowItem: {
    flex: 2
  }
};
const timeData = ["VdyavG", "PJZnfHy", "AbCcrQj", "pXSyT"];
// const newsData = "XCYtj";
const subscriptionData = ["RpNskFZ", "cJFjMjN"];
const engagementData = ["JwPMwn", "BLMkPQn"];

const positions = [
  { id: 0, anchor: "summary", label: "Summary" },
  { id: 1, anchor: "subs", label: "Subscriptions" },
  { id: 2, anchor: "engagement", label: "Engagement" },
  { id: 3, anchor: "revenue", label: "Revenue YTD" },
  { id: 4, anchor: "traffic", label: "Traffic" }
];

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
  const {
    rxq: { doc$ }
  } = useSession()[0];

  const [kpiValues, setKpiValues] = useState({
    netSubs: "-",
    clicksOpen: "-",
    clicksSub: "-",
    revenue: "-",
    revenueSub: "-",
    visits: "-",
    visitsSub: "-"
  });

  useEffect(() => {
    const sub$ = doc$
      .pipe(
        qAskReplayRetry("CreateSessionObject", {
          qInfo: { qType: "kpi" },
          netSubs: {
            qValueExpression:
              "=sum({<mailing_status=>}Sub_Count) - sum({<mailing_status=>}Unsub_Count)"
          },
          clicksOpen: {
            qValueExpression: "=sum(unique_clicks)/sum(unique_opens)"
          },
          clicksSub: {
            qValueExpression:
              "=(num(sum(unique_opens)/(sum(sent)-sum(bounce)), '#,##0.0%'))"
          },
          revenue: {
            qValueExpression:
              "=sum({<[Join Snapshot]={'$(vSalesTY)'},Date=,mailing_status=,[Revenue Type]={*},[Company]={*}>}Revenue)"
          },
          revenueSub: {
            qValueExpression:
              "=(num((sum({<[Join Snapshot]={'$(vSalesTY)'},Date=,mailing_status=,[Revenue Type]={*},[Company]={*}>}Revenue) - sum({<[Join Snapshot]={'$(vSalesLY)'},Date=,mailing_status=,[Revenue Type]={*},[Company]={*}>}Revenue))/sum({<[Join Snapshot]={'$(vSalesLY)'},Date=,mailing_status=,[Revenue Type]={*},[Company]={*}>}Revenue), '#,##0.0%'))"
          },
          visits: {
            qValueExpression: "=Sum({<mailing_status=>}total_nl_visits)"
          },
          visitsSub: {
            qValueExpression:
              "=(num(sum({<mailing_status=>}total_nl_visits)/sum({<mailing_status=>}total_visits), '#,##0.0%'))"
          }
        }),
        invalidations(true),
        qAskReplayRetry("GetLayout")
      )
      .subscribe(layout => {
        setKpiValues({
          netSubs: format(".2s")(layout.netSubs),
          clicksOpen: format(".1%")(layout.clicksOpen),
          clicksSub: format(",.1%")(layout.clicksSub),
          revenue: format("$.2s")(layout.revenue),
          revenueSub: format("+.2%")(layout.revenueSub),
          visits: format(".2s")(layout.visits),
          visitsSub: format(".1%")(layout.visitsSub)
        });
      });

    return () => sub$.unsubscribe();
  }, [doc$]);

  return (
    <div className={classes.emailContainer}>
      <Navigator positions={positions} />
      {/* Summary Tile */}
      <div className={classes.tileContainer}>
        <Tile title={title.summary} anchor={"summary"}>
          <div className={classes.kpiContainer}>
            <div className={classes.kpiColumn}>
              <Kpi className={classes.kpiObject} label="Net Subs">
                <div className={classes.kpiValue}>{kpiValues.netSubs}</div>
              </Kpi>
              <div className={classes.kpiSource}>Acxiom</div>
            </div>
            <div className={classes.kpiColumn}>
              <Kpi className={classes.kpiObject} label="Clicks to Open %">
                <div className={classes.kpiValue}>{kpiValues.clicksOpen}</div>
                <div
                  className={classes.kpiSub}
                >{`Unique Open: ${kpiValues.clicksSub}`}</div>
              </Kpi>
              <div className={classes.kpiSource}>Silverpop</div>
            </div>
            <div className={classes.kpiColumn}>
              <Kpi className={classes.kpiObject} label="Revenue YTD">
                <div className={classes.kpiValue}>{kpiValues.revenue}</div>
                <div
                  className={classes.kpiSub}
                >{`${kpiValues.revenueSub} YoY`}</div>
              </Kpi>
              <div className={classes.kpiSource}>Adbook</div>
            </div>
            <div className={classes.kpiColumn}>
              <Kpi className={classes.kpiObject} label="Visits">
                <div className={classes.kpiValue}>{kpiValues.visits}</div>
                <div
                  className={classes.kpiSub}
                >{`${kpiValues.visitsSub} Traffic Share`}</div>
              </Kpi>
              <div className={classes.kpiSource}>Google Analytics</div>
            </div>
          </div>
        </Tile>
      </div>
      <EmailDualChart
        anchor={"subs"}
        data={subscriptionData}
        title={title.subscriptions}
        downloadIds={["RpNskFZ", "cJFjMjN"]}
        footer={"Source: Axciom"}
      />
      <EmailDualChart
        anchor={"engagement"}
        data={engagementData}
        title={title.engagement}
        downloadIds={["JwPMwn", "BLMkPQn"]}
        footer={"Source: Silverpop"}
      />
      <EmailMultipleChart
        anchor={"revenue"}
        data={revenueData}
        title={title.revenue}
        type="revenue"
        downloadIds={["RUMhhFk", "PeKKS", "zexksT"]}
        footer={"Source: Adbook"}
      />
      <EmailMultipleChart
        anchor={"traffic"}
        data={trafficData}
        title={title.traffic}
        downloadIds={["ezpwKU", "eJZJe", "amGPVAj", "prhbYm"]}
        footer={"Source: Omniture & Google Analytics"}
      />
    </div>
  );
};

export default withStyles(styles)(Email);
