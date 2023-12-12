import { h, FunctionComponent, createContext } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';

import { User } from '../models';
import { getRequest } from '../xhr/utils';

const UserContext = createContext(null as User | null);

export const UserProvider: FunctionComponent = ({ children }) => {
  const [user, setUser] = useState(null as User | null);

  useEffect(() => {
    getRequest("/backend/info").then(data => setUser(data));
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
