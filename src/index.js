import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import Amplify, { Auth } from "aws-amplify";

// https://docs.amplify.aws/lib/restapi/getting-started/q/platform/js
Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: "us-east-1",
    userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_COGNITO_APP_CLIENT_ID,
    oauth: {
      domain: process.env.REACT_APP_COGNITO_DOMAIN,
      scope: ["email", "openid", "phone"],
      redirectSignIn: "http://localhost:3000/",
      redirectSignOut: "http://localhost:3000/",
      responseType: "token",
    },
  },
  API: {
    endpoints: [
      {
        name: "MyApiGateway",
        endpoint: process.env.REACT_APP_API_GATEWAY_URL,
        region: "us-east-1",
        custom_header: async () => {
          return {
            Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
          };
        },
      },
    ],
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

