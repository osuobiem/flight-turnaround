import React from "react";
import ManageTeams from "../components/Tables/ManageTeams/ManageTeams";
import AdminHeader from "../components/AdminHeader/AdminHeader";

// import * as msTeams from '@microsoft/teams-js';

const AdminDashboard = () => {

  // const popWindow = async () => {
  //   await msTeams.authentication.authenticate({
  //     url: window.location.origin + "/consent-popup-start.html",
  //     width: 600,
  //     height: 535,
  //     successCallback: (() => {
  //       console.log('Got success callback');
  //     })
  //   });
  // }

  // Get a client side token from Teams
  // const getTokenFromTeams = async () => {

  //   msTeams.initialize();
  //   return new Promise((resolve, reject) => {
  //       msTeams.authentication.getAuthToken({
  //         successCallback: (result) => { alert(result); console.log(result); resolve(result); },
  //           failureCallback: (error) => { alert(error); console.error(error); reject(error); }
  //       });
  //   });
  // }

  return (
    <div>
      <AdminHeader />
      <ManageTeams />
    </div>
  );
};

export default AdminDashboard;
