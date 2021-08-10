export default [
  {
    name: process.env.REACT_APP_NAME,
    host: process.env.REACT_APP_HOST,
    appname: process.env.REACT_APP_APPNAME,
    initialBookmark: process.env.REACT_APP_INITIAL_BOOKMARK,
    isSecure: process.env.REACT_APP_ISSECURE === "true",
    port: Number(process.env.REACT_APP_PORT),
    isCloud: process.env.REACT_APP_HOST.includes("qlikcloud") ? true : false,
    webIntegrationId: process.env.REACT_APP_WEB_INTEGRATION_ID,
    initialSelections: [
      {
        field: process.env.REACT_APP_SELECTION_FIELD,
        values: [{ qText: process.env.REACT_APP_SELECTION_QTEXT }]
      }
    ]
  }
];
