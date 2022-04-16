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
      msTeams.authentication.authenticate({
        url: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=9d7b0900-3c58-4fda-8156-34b3635d25d0&scope=openid%20profile%20offline_access&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fadmin&client-request-id=5a5d83b6-b4a7-4cea-8f2e-a88c5b9ace66&response_mode=fragment&response_type=code&x-client-SKU=msal.js.browser&x-client-VER=2.23.0&client_info=1&code_challenge=PiTTUxHVLnEdpHbD5DLLfsy4KLrd0ZfP6dymgLJ2n7Y&code_challenge_method=S256&nonce=112974af-4f31-415a-a61b-fc454a88f64e&state=eyJpZCI6ImZhMGNiYzUwLTNhZjItNDVkNC05Y2VmLTg0MmY3MmM3MzZjOSIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicG9wdXAifX0%3D',
        width: 600,
        height: 535,
        successCallback: ((res) => {
          alert(res);
            console.log(res);
        }),
        failureCallback: (err => console.error(err))
      });
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

  return (
    <div>
      <AdminHeader people={people} graphClient={graphClient} />
      <ManageTeams people={people} graphClient={graphClient} />
    </div>
  );
};

export default AdminDashboard;
