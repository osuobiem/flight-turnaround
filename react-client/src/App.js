import { BrowserRouter } from "react-router-dom";
import Router from "./routes/Router";
import { Provider, teamsTheme, teamsDarkTheme, teamsHighContrastTheme  } from "@fluentui/react-northstar";
import { useState, useCallback, useEffect } from "react";
import * as msTeams from '@microsoft/teams-js';
import { AppContext, AuthContext, StationsContext, LoaderContext } from './AppContext';
import {api} from "./helpers/ApiHandler";
import AppLoader from './components/AppLoader/AppLoader';

msTeams.initialize();

function App() {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [auth, setAuthClient] = useState();
  const [stations, setStations] = useState({});
  const [showLoader, setShowLoader] = useState(false);

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

  const dispatchLoaderEvent = useCallback(show => {
    setShowLoader(show);
  }, []);

  // Set current theme
  msTeams.getContext(context => setCurrentTheme(context.theme));

  // Handle theme change
  msTeams.registerOnThemeChangeHandler(theme => {
    dispatchThemeEvent(theme);
  });

  const getStations = useCallback(async () => {
    setShowLoader(true);

    await api('getStations').then(res => {
      let stationsObj = {};
      [...res.data.data].forEach(s => {
        stationsObj[s.StationCode] = s.StationName;
      });

      setStations(stationsObj);
      setShowLoader(false);
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
            <LoaderContext.Provider value={{ showLoader, dispatchLoaderEvent }}>

              <AppLoader theme={currentTheme} />

              <BrowserRouter>
                <Router />
              </BrowserRouter>
            </LoaderContext.Provider>
          </StationsContext.Provider>
        </AuthContext.Provider>
      
      </AppContext.Provider>
    </Provider>
  );
}

export default App;
