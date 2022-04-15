import React from "react";
import ManageTeams from "../components/Tables/ManageTeams/ManageTeams";
import AdminHeader from "../components/AdminHeader/AdminHeader";

import * as msTeams from '@microsoft/teams-js';

msTeams.initialize();

const AdminDashboard = () => {

  const popWindow = () => {
    let authTokenRequest = {
      successCallback: function (result) {
        console.log(result);
        alert(result);
        //call server side to exchange the  token from teams with access token & used it to call graph
        // fetch("/token?token=" + result)              
        //             .then(json => json.json()).then(result=> {
        //                 document.getElementById("jsonData").textContent = JSON.stringify(result, undefined, 2);
        //             });


      },
      failureCallback: function (error) { console.log("Failure: " + error); alert("Failure: " + error); },
    };
    msTeams.authentication.getAuthToken(authTokenRequest);
  };

  return (
    <div>
      <button onClick={popWindow()}>Click Me</button>
      <AdminHeader />
      <ManageTeams />
    </div>
  );
};

export default AdminDashboard;
