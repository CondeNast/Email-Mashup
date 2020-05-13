import React, { createContext, useContext, useMemo, useEffect } from "react";
import { QdtComponents } from "dash-component-library/components";
import queryString from "query-string";
import uuidv4 from "uuid/v4";
import { connectSession, qAskReplay } from "rxq";
import { of, forkJoin } from "rxjs";
import { shareReplay, switchMap, mapTo } from "rxjs/operators";
// import { createBrowserHistory } from "history";
// const history = createBrowserHistory();

/** Convert the incoming qlik config to format supported by qdt */
const qdtConfigGenerator = ({
  host,
  isSecure: secure = true,
  port = 443,
  prefix = "",
  appname: appId
}) => ({ host, secure, port, prefix, appId });

/** Create Context */
const SessionContext = createContext();

/** Session Component */
export const SessionProvider = ({
  qlikConfig,
  initialSelections = [],
  children
}) => {
  /** Serialize config to track updates */
  const _serializedConfig = JSON.stringify(qlikConfig);

  /** Convert to array */
  const qlikConfigArray = useMemo(
    () => (Array.isArray(qlikConfig) ? qlikConfig : [qlikConfig]),
    [_serializedConfig]
  );

  /** Sessions */
  const sessions = useMemo(
    () =>
      /** For each qlik config.. */
      qlikConfigArray.map(config => {
        /** Create a new session id */
        const sessionId = uuidv4();

        /** Create a new QdtComponents instance */
        const qdtComponents = new QdtComponents(qdtConfigGenerator(config), {
          vizApi: true,
          engineApi: true,
          useUniqueSessionID: sessionId
        });

        /** Create a new RxQ session */
        const rxqSession = connectSession({
          ...config,
          identity: sessionId
        });
        const rxqGlobal$ = rxqSession.global$.pipe(shareReplay(1));
        const rxqDoc$ = rxqGlobal$.pipe(
          qAskReplay("OpenDoc", config.appname),
          switchMap(h => {
            if (
              config.initialSelections !== undefined &&
              config.initialSelections.length > 0
            ) {
              let selections = config.initialSelections.map(fieldSelection => {
                return h
                  .ask("GetField", fieldSelection.field)
                  .pipe(qAskReplay("SelectValues", fieldSelection.values));
              });
              return forkJoin(...selections).pipe(mapTo(h));
            } else if (config.initialBookmark) {
              // let bookmark$ = h.ask("ApplyBookmark", config.initialBookmark);
              // return bookmark$.pipe(mapTo(h));
            }
            return of(h);
          }),
          shareReplay(1)
        );

        // make sure the rxq stuff runs at least once
        rxqDoc$.subscribe();
        /** return the QdtComponent session and RxQ session for this config */
        return {
          name: config.name,
          app: config.appname,
          initialBookmark: config.initialBookmark,
          initialSelections: config.initialSelections,
          sessionId,
          qdtComponents,
          rxq: { session: rxqSession, global$: rxqGlobal$, doc$: rxqDoc$ }
        };
      }),
    [_serializedConfig]
  );

  // useEffect(() => {
  //   const selections$ = from(sessions)
  //     .pipe(
  //       filter(
  //         session =>
  //           session.initialSelections !== undefined &&
  //           session.initialSelections.length > 0
  //       ),
  //       mergeMap(session =>
  //         from(session.initialSelections).pipe(
  //           concatMap(fieldSelection =>
  //             session.rxq.doc$.pipe(
  //               qAskReplay("GetField", fieldSelection.field),
  //               qAskReplay(
  //                 "SelectValues",
  //                 fieldSelection.values
  //               )
  //             )
  //           )
  //         )
  //       )
  //     )
  //     .subscribe();

  //   return () => selections$.unsubscribe();
  // }, [sessions]);

  /** Return Context Provider */
  return (
    <SessionContext.Provider value={sessions}>
      {children}
    </SessionContext.Provider>
  );
};

/** Accessible context consumer */
export const useSession = () => useContext(SessionContext);
