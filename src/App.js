import { BrowserRouter } from "react-router-dom";
import Router from "./routes/Router";
import { Provider, teamsTheme, teamsDarkTheme, teamsHighContrastTheme  } from "@fluentui/react-northstar";
import { useState, useCallback, useEffect } from "react";
import * as msTeams from '@microsoft/teams-js';
import { AppContext, AuthContext, StationsContext } from './AppContext';
import {api} from "./helpers/ApiHandler";

msTeams.initialize();

function App() {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [auth, setAuthClient] = useState();
  const [stations, setStations] = useState({});

  const themes = {
    default: teamsTheme, dark: teamsDarkTheme, contrast: teamsHighContrastTheme
  };

  const dispatchThemeEvent = (theme) => {
    setCurrentTheme(theme);
  }

  const dispatchAuthEvent = useCallback((auth) => {
    setAuthClient(auth);
  }, [])

  const dispatchStationsEvent = useCallback(stations => {
    setStations(stations);
  }, []);

  // Set current theme
  msTeams.getContext(context => setCurrentTheme(context.theme));

  // Handle theme change
  msTeams.registerOnThemeChangeHandler(theme => {
    dispatchThemeEvent(theme);
  });

  const getStations = useCallback(async () => {
    await api('getStations').then(res => {
      let stationsObj = {};
      [...res.data.data].forEach(s => {
        stationsObj[s.StationCode] = s.StationName;
      });

      setStations(stationsObj);
    })
  }, []);

  useEffect(() => {
    getStations();
  }, [getStations]);

  return (
    <Provider theme={themes[currentTheme]}>
      <AppContext.Provider value={{ currentTheme, dispatchThemeEvent }}>
        
      <AuthContext.Provider value={{ auth, dispatchAuthEvent }}>
          <StationsContext.Provider value={{ stations, dispatchStationsEvent }}>
            <BrowserRouter>
              <Router />
            </BrowserRouter>
          </StationsContext.Provider>
        </AuthContext.Provider>
      
      </AppContext.Provider>
    </Provider>
  );
}

export default App;
