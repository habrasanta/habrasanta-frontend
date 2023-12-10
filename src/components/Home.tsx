import { FunctionComponent } from "preact";
import { route } from "preact-router";
import { useEffect } from "preact/hooks";

import { BackendInfo, Season } from "../models";

const Home: FunctionComponent<{
  info: BackendInfo,
}> = props => {
  useEffect(() => {
    fetch("/api/v1/seasons/latest")
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then((data: Season) => route("/" + data.id + (props.info.is_authenticated ? "/profile/" : "/"), true))
      .catch(res => res.json().then(err => alert(err.detail)));
  }, []);

  return null;
};

export default Home;
