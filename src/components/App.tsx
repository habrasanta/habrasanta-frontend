import { h, FunctionComponent } from "preact";
import Router from "preact-router";
import { useEffect, useState } from "preact/hooks";

import Home from "./Home";
import Landing from "./Landing";
import Profile from "./Profile";

const App: FunctionComponent = () => {
  const [info, setInfo] = useState();

  useEffect(() => {
    fetch("/backend/info").then(res => res.json()).then(data => setInfo(data));
  }, []);

  return info ? (
    <Router>
      <Home path="/" info={info} />
      <Landing path="/:year/" info={info} />
      <Profile path="/:year/profile/" info={info} />
    </Router>
  ) : (
    <p style={{color:"white"}}>Loading backend info...</p>
  );
};

export default App;
