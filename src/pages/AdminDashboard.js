import React, {useState, useCallback} from "react";
import ManageTeams from "../components/Tables/ManageTeams/ManageTeams";
import AdminHeader from "../components/AdminHeader/AdminHeader";

import * as msTeams from '@microsoft/teams-js';
import {useEffect} from "react";
import {graphApi} from "../helpers/ApiHandler";
msTeams.initialize();

const AdminDashboard = () => {

  const [teams, setTeams] = useState([]);

  let tokenExpire = parseInt(localStorage.getItem('gatTokenExp')) ?? (new Date().getTime()) + 3600;
    
  const getToken = useCallback(async () => {
    let token = await new Promise((resolve, reject) => {
        msTeams.authentication.getAuthToken({
          successCallback: (result) => { console.log(result); resolve(result); },
            failureCallback: (error) => { console.log(error); reject(error); }
        });
    });

    await graphApi('switchToken', {}, {access_token: token}).then(() => localStorage.setItem('gatTokenExp', tokenExpire.toString()));
    await fetchTeams();
  }, [tokenExpire]);

  useEffect(() => {
    if(tokenExpire < new Date().getTime()) {
      getToken();
    }
  }, [tokenExpire, getToken]);

  const fetchTeams = async () => {
    await graphApi('getTeams').then(res => {
      setTeams(res.data.data.value);
    })
  }

  return (
    <div>
      <AdminHeader />
      <ManageTeams />
    </div>
  );
};

export default AdminDashboard;