import { h, FunctionComponent } from "preact";
import { Route, Router } from "preact-router";

import { UserProvider, useUser } from './contexts/UserContext';
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";

const Routes: FunctionComponent = () => {
  const user = useUser();

  if (!user) return <p style={{color:"white"}}>Loading backend info...</p>;

  return <Router>
    <Route path="/" component={Home} />
    <Route path="/:year" component={Landing} />
    <Route path="/:year/profile" component={Profile} />
  </Router>;
};

const App: FunctionComponent = () => {
  return <UserProvider>
    <Routes />
  </UserProvider>;
};

export default App;
