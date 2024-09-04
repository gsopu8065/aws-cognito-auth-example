import "./App.css";
import { Button, makeStyles } from "@material-ui/core";
import { API, Auth } from "aws-amplify";
import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import LoadingOverlay from "react-loading-overlay";

const useStyles = makeStyles((theme) => ({
  panel: {
    "& > *": {
      margin: theme.spacing(1),
    },
    padding: theme.spacing(1),
  },
  button: {
    width: theme.spacing(17),
  },
}));

export default function App() {
  const classes = useStyles();
  const URL = "/test/Converse";
  const endpoint = "MyApiGateway";

  const [isAuth, setAuth] = useState(false);
  const [email, setEmail] = useState("");
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const currentSession = async () => {
      try {
        const response = await Auth.currentSession();
        if (response) {
          setAuth(true);
          setEmail(response.getIdToken().payload.email);
          setData(response);
          console.log(response);
        }
      } catch (e) {
        console.log(e);
      }
    };

    currentSession();
  }, []);

  const signIn = () => {
    Auth.federatedSignIn({ provider: ['Google', 'LoginWithAmazon'] });
  };

  const signOut = async () => {
    await Auth.signOut();
    setAuth(false);
  };

  async function testAPI() {
    setLoading(true);
    console.log(API);
    try {
      const response = await API.get(endpoint, URL);
      setData(response);
      console.log(response);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  return (
    <LoadingOverlay active={isLoading} spinner text="Loading. Please wait..." className="App">
      <div>
        <div className={classes.panel}>
          <Button onClick={signIn} className={classes.button} variant="contained" color="primary">
            Sign In
          </Button>
          <Button onClick={signOut} className={classes.button} variant="contained">
            Sing Out
          </Button>
          <span className={classes.button}>{isAuth ? "Welcome " + email : "Please sign in"}</span>
        </div>
        <div className={classes.panel}>
          <Button onClick={testAPI} className={classes.button} variant="contained" color="primary">
            Test API Gateway
          </Button>
        </div>
        <ReactJson src={data} name={false} theme="monokai" style={{ fontSize: 15 }} />
      </div>
    </LoadingOverlay>
  );
}
