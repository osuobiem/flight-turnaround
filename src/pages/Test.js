import React from "react";
import { useEffect } from "react";
import msalInstance from "../config/msalInstance";
import { useCallback } from "react";

import * as msTeams from "@microsoft/teams-js";
msTeams.initialize();

const Test = () => {

  // Check if user account exists in session storage
  const checkForAccount = useCallback(async () => {
    msalInstance.loginPopup();
  }, []);

  useEffect(() => {
    checkForAccount();
  }, [checkForAccount]);

  return (
    <div>
      <p>Authorizing...</p>
    </div>
  );
};

export default Test;
