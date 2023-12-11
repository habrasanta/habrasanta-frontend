import { h, FunctionComponent } from "preact";
import { Route, Router, route } from "preact-router";

import { UserProvider, useUser } from './contexts/UserContext';
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import { CurrentSeasonProvider, useCurrentSeason } from "./contexts/CurrentSeason";

const Routes: FunctionComponent = () => {
  const user = useUser();
  const currentSeason = useCurrentSeason();

  if (!user || !currentSeason) return <p style={{color:"white"}}>Loading backend info...</p>;

  const handleRoute = () => {
    // goes async because router needs to initialize routes on initial render
    if (user.is_authenticated) {
      setTimeout(() => route(`/${currentSeason.id}/profile`, true), 0);
    } else {
      setTimeout(() => route(`/${currentSeason.id}/`, true), 0);
    }
  };

  return <Router onChange={handleRoute}>
    <Route path="/:year" component={Landing} />
    <Route path="/:year/profile" component={Profile} />
  </Router>;
};

const App: FunctionComponent = () => {
  return <UserProvider>
    <CurrentSeasonProvider>
      <Routes />
    </CurrentSeasonProvider>
  </UserProvider>;
};

export default App;
