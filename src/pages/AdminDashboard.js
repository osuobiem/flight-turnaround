import React, { useContext } from "react";
import ManageTeams from "../components/Tables/ManageTeams/ManageTeams";
import AdminHeader from "../components/AdminHeader/AdminHeader";

import { AuthContext } from "../AppContext";
import { useEffect } from "react";
import msalInstance from "../config/msalInstance";
import { EventType, InteractionType } from "@azure/msal-browser";
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser'
import { useState } from "react";
import { Client } from "@microsoft/microsoft-graph-client";
import { graphApi } from "../helpers/GraphHandler";

const AdminDashboard = () => {

  const [dummy] = useState(false);
  const { auth, dispatchAuthEvent } = useContext(AuthContext);
  const [graphClient, setGraphClient] = useState({});
  const [people, setPeople] = useState([]);

  useEffect(() => {
    checkForAccount();
  }, [dummy]);

  useEffect(() => {
    if(auth) setClient();
  }, [auth]);

  useEffect(() => {
    if (Object.entries(graphClient).length > 0) getPeople();
}, [graphClient])

  const checkForAccount = async () => {
    const accounts = msalInstance.getAllAccounts();
    
    if (accounts && accounts.length > 0) {
      msalInstance.setActiveAccount(accounts[0]);
    }
    else {
      msalInstance.loginPopup();
    }

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
  }

  const setClient = () => {
      let client = Client.initWithMiddleware({ authProvider: auth });
      setGraphClient(client);
  }

  // Fetch People using GrapAPI
  const getPeople = async () => {
    const p = await graphApi('getPeople', graphClient);

    let newPeople = p.value.map(person => {
        return { id: person.id, name: person.displayName, content: person.jobTitle, header: person.displayName };
    });

    setPeople(newPeople);
}

  return (
    <div>
        <AdminHeader people={people} graphClient={graphClient} />
        <ManageTeams people={people} graphClient={graphClient} />
    </div>
  );
};

export default AdminDashboard;
