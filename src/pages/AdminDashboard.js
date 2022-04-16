import React, { useContext } from "react";
import ManageTeams from "../components/Tables/ManageTeams/ManageTeams";
import AdminHeader from "../components/AdminHeader/AdminHeader";

import { AuthContext } from "../AppContext";
import { useEffect } from "react";
import msalInstance from "../config/msalInstance";
import { InteractionType, EventType } from "@azure/msal-browser";
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { useState } from "react";
import { Client } from "@microsoft/microsoft-graph-client";
import { graphApi } from "../helpers/GraphHandler";
import { useCallback } from "react";

import * as msTeams from "@microsoft/teams-js";
msTeams.initialize();

const AdminDashboard = () => {

  const { auth, dispatchAuthEvent } = useContext(AuthContext);
  const [graphClient, setGraphClient] = useState({});
  const [people, setPeople] = useState([]);

  // Check if user account exists in session storage
  const checkForAccount = useCallback(async () => {
    const accounts = msalInstance.getAllAccounts();

    if (accounts && accounts.length > 0) {
      msalInstance.setActiveAccount(accounts[0]);
    }
    else {
      
      // msalInstance.loginPopup();
    }

    msalInstance.handleRedirectPromise().then((tokenResponse) => {
      if (tokenResponse) {
        msalInstance.setActiveAccount(tokenResponse.account);
      }
    }).catch((error) => {
      console.error(error);
    });

    msalInstance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const authResult = event.payload;
        msalInstance.setActiveAccount(authResult.account);
      }
    });

    dispatchAuthEvent(new AuthCodeMSALBrowserAuthenticationProvider(
      msalInstance,
      {
        account: msalInstance.getActiveAccount(),
        scopes: [
          'user.read',
          'mailboxsettings.read',
          'calendars.readwrite',
          'user.read.all',
          'group.read.all',
          'User.ReadWrite.All',
          'User.ReadBasic.All',
          'People.Read',
          'People.Read.All'
        ],
        interactionType: InteractionType.Popup
      }
    ));
  }, [dispatchAuthEvent]);


  // Fetch People using GrapAPI
  const getPeople = useCallback(async () => {
    const p = await graphApi('getPeople', graphClient);

    let newPeople = p.value.map(person => {
      return { id: person.id, name: person.displayName, content: person.jobTitle, header: person.displayName };
    });

    setPeople(newPeople);
  }, [graphClient]);

  useEffect(() => {
    checkForAccount();
  }, [checkForAccount]);

  useEffect(() => {
    if (auth) {
      let client = Client.initWithMiddleware({ authProvider: auth });
      setGraphClient(client);
    }
  }, [auth]);

  useEffect(() => {
    if (Object.entries(graphClient).length > 0) getPeople();
  }, [graphClient, getPeople]);

  const popUp = async () => {
    await msTeams.authentication.authenticate({
      url: 'test',
      width: 600,
      height: 535,
      successCallback: ((res) => {
        alert(res);
          console.log(res);
      }),
      failureCallback: (err => console.error(err))
    });
  }

  return (
    <div>
      <button onClick={() => popUp()}>Authorize Application</button>
      <AdminHeader people={people} graphClient={graphClient} />
      <ManageTeams people={people} graphClient={graphClient} />
    </div>
  );
};

export default AdminDashboard;
