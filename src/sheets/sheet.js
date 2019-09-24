import React, { useEffect, useState } from "react";
import { NavPanel } from "../components";
import {
  Tile,
  Kpi,
  QdtComponent,
  Navigator
} from "dash-component-library/components";
import { useSession } from "dash-component-library/context";
import { qAskReplay, invalidations } from "rxq";
import { switchMap, retry } from "rxjs/operators";
import { format } from "d3";
import withStyles from "react-jss";
import classNames from "classnames";

const styles = {
  kpiContainer: {
    display: "flex",
    justifyContent: "space-around"
  },
  tile: { marginTop: "10px" }
};

const positions = [
  { id: 0, anchor: "summary", label: "Summary" },
  { id: 1, anchor: "category-performance", label: "Category Performance" }
];

export default withStyles(styles)(({ classes }) => {
  const {
    rxq: { doc$ }
  } = useSession()[0];

  const [kpiValues, setKpiValues] = useState({
    articles: "-",
    medianUVS: "-",
    avgHVA: "-",
    avgAboveMedian: "-"
  });

  useEffect(() => {
    const sub$ = doc$
      .pipe(
        qAskReplay("CreateSessionObject", {
          qInfo: { qType: "kpi" },
          articles: {
            qValueExpression: "=Count(distinct entityid)"
          },
          medianUVS: {
            qValueExpression:
              "=median(total aggr(sum(distinct total <entityid> uid),entityid))"
          },
          avgHVA: {
            qValueExpression: "=sum(distinct hvas)/sum(distinct uid)"
          },
          avgAboveMedian: {
            qValueExpression:
              "=sum(if(aggr(sum(distinct total <entityid> uid),entityid)>median(total aggr(sum(distinct total <entityid> uid),entityid)),aggr(sum(distinct total <entityid> uid),entityid)))/if(floor(count(distinct entityid)/2) <1,1,floor(count(distinct entityid)/2))"
          }
        }),
        invalidations(true),
        switchMap(h => h.ask("GetLayout").pipe(retry(3)))
      )
      .subscribe(layout => {
        setKpiValues({
          articles: format(",.0f")(layout.articles),
          medianUVS: format(",.0f")(layout.medianUVS),
          avgHVA: format(".1%")(layout.avgHVA),
          avgAboveMedian: format(",.0f")(layout.avgAboveMedian)
        });
      });

    return () => sub$.unsubscribe();
  }, []);

  return (
    <div>
      <NavPanel />
      <Tile anchor="summary" title="SUMMARY">
        <div className={classNames(classes.kpiContainer, classes.tile)}>
          <Kpi label="Articles">{kpiValues.articles}</Kpi>
          <Kpi label="Median UVS">{kpiValues.medianUVS}</Kpi>
          <Kpi label="Avg HVA">{kpiValues.avgHVA}</Kpi>
          <Kpi label="Avg Above Median">{kpiValues.avgAboveMedian}</Kpi>
        </div>
      </Tile>
      <Tile
        className={classes.tile}
        anchor="category-performance"
        title="CATEGORY PERFORMANCE"
      >
        <QdtComponent
          type="QdtViz"
          qdtProps={{ type: "viz", id: "BqfqmH", height: "800px" }}
        />
        <QdtComponent
          type="QdtViz"
          qdtProps={{ type: "viz", id: "RKwDPC", height: "40px" }}
        />
        <QdtComponent
          type="QdtViz"
          qdtProps={{ type: "viz", id: "wUgGx", height: "500px" }}
        />
      </Tile>
      <Navigator positions={positions} />
    </div>
  );
});
