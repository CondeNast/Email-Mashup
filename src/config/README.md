# Qlik Config

The qlikConfig object defines the host to connect to and the app from which we will be pulling data. You have the option of defining a single qlikConfig object, or an array of qlikConfig objects.

## qlikConfig

| Property | Description                                             | Type                         |
| -------- | ------------------------------------------------------- | ---------------------------- |
| host     | Sense host address                                      | string                       |
| isSecure | Indicates whether to use a secure web socket connection | bool                         |
| port     | Port of connection                                      | number; either `443` or `80` |
| appname  | id of app to connect to                                 | string                       |
