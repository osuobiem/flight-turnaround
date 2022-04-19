import React, {useState, useCallback} from "react";
import ManageTeams from "../components/Tables/ManageTeams/ManageTeams";
import AdminHeader from "../components/AdminHeader/AdminHeader";

import * as msTeams from '@microsoft/teams-js';
import {useEffect} from "react";
msTeams.initialize();

const AdminDashboard = () => {

  const [tokenExpired] = useState(true);
    
  const getToken = useCallback(async () => {
    return await new Promise((resolve, reject) => {
        msTeams.authentication.getAuthToken({
          successCallback: (result) => { console.log(result); resolve(result); },
            failureCallback: (error) => { reject(error); }
        });
    });
  }, []);

  useEffect(() => {
    if(tokenExpired) {
      getToken();
    }
  }, [tokenExpired, getToken]);

  return (
    <div>
      <AdminHeader />
      <ManageTeams />
    </div>
  );
};

export default AdminDashboard;
