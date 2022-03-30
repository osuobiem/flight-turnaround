import { BrowserRouter } from "react-router-dom";
import Router from "./routes/Router";
import { Provider, teamsTheme, teamsDarkTheme, teamsHighContrastTheme  } from "@fluentui/react-northstar";
import { useState } from "react";
import * as msTeams from '@microsoft/teams-js';

msTeams.initialize();

function App() {
  const [currentTheme, setCurrentTheme] = useState('default');

  const themes = {
    default: teamsTheme, dark: teamsDarkTheme, contrast: teamsHighContrastTheme
  };

  // Set current theme
  msTeams.getContext(context => setCurrentTheme(context.theme));

  // Handle theme change
  msTeams.registerOnThemeChangeHandler(theme => {
    setCurrentTheme(theme);
  });

  return (
    <Provider theme={themes[currentTheme]}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
