import React from "react";
import ManageTeams from "../components/Tables/ManageTeams/ManageTeams";
import AdminHeader from "../components/AdminHeader/AdminHeader";

import * as msTeams from '@microsoft/teams-js';

msTeams.initialize();

const AdminDashboard = () => {

  const popWindow = async () => {
    await msTeams.authentication.authenticate({
      url: window.location.origin + "/consent-popup-start.html",
      width: 600,
      height: 535,
      successCallback: (() => {
        console.log('Got success callback');
      })
    });
  }

  return (
    <div>
      <button onClick={() => popWindow()}>Click Me</button>
      <AdminHeader />
      <ManageTeams />
    </div>
  );
};

export default AdminDashboard;
