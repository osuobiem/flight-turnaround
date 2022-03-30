import { BrowserRouter } from "react-router-dom";
import Router from "./routes/Router";
import { Provider, teamsTheme, teamsDarkTheme, teamsHighContrastTheme  } from "@fluentui/react-northstar";
import { useState } from "react";
import * as msTeams from '@microsoft/teams-js';
import { AppContext } from './AppContext';

msTeams.initialize();

function App() {
  const [currentTheme, setCurrentTheme] = useState('default');

  const themes = {
    default: teamsTheme, dark: teamsDarkTheme, contrast: teamsHighContrastTheme
  };

  const dispatchThemeEvent = (theme) => {
    setCurrentTheme(theme);
  }

  // Set current theme
  msTeams.getContext(context => setCurrentTheme(context.theme));

  // Handle theme change
  msTeams.registerOnThemeChangeHandler(theme => {
    dispatchThemeEvent(theme);
  });

  return (
    <Provider theme={themes[currentTheme]}>
      <AppContext.Provider value={{ currentTheme, dispatchThemeEvent }}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </AppContext.Provider>
    </Provider>
  );
}

export default App;
