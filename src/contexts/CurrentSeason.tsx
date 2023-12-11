import { h, FunctionComponent, createContext } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';

import { Season } from '../models';
import { getRequest } from '../xhr/utils';

const CurrentSeasonContext = createContext(null as Season | null);

export const CurrentSeasonProvider: FunctionComponent = ({ children }) => {
  const [currentSeason, setCurrentSeason] = useState(null as Season | null);

  useEffect(() => {
    const { pathname } = window.location;
    const seasonId = pathname.split('/')[1] || 'latest';
  
    getRequest(`/api/v1/seasons/${seasonId}`).then(data => setCurrentSeason(data));
  }, []);

  return (
    <CurrentSeasonContext.Provider value={currentSeason}>
      {children}
    </CurrentSeasonContext.Provider>
  );
}

export function useCurrentSeason() {
  return useContext(CurrentSeasonContext);
}
