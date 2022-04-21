import React, {useState, useCallback} from "react";
import ManageTeams from "../components/Tables/ManageTeams/ManageTeams";
import AdminHeader from "../components/AdminHeader/AdminHeader";

import * as msTeams from '@microsoft/teams-js';
import {useEffect} from "react";
import {api, graphApi} from "../helpers/ApiHandler";
msTeams.initialize();

const AdminDashboard = () => {

  const [teams, setTeams] = useState([]);
    
  const fetchTeams = useCallback(async () => {
    await api('getTeams').then(res => {
      setTeams(res.data.data);
    });
  }, [setTeams]);

  const getToken = useCallback(async () => {
    let token = await new Promise((resolve, reject) => {
        msTeams.authentication.getAuthToken({
          successCallback: (result) => { console.log(result); resolve(result); },
            failureCallback: (error) => { console.log(error); reject(error); }
        });
    });

    let tokenExpire = (new Date().getTime()) + 3600;

    await graphApi('switchToken', {}, {access_token: token}).then(() => localStorage.setItem('gatTokenExp', tokenExpire.toString()));
  }, []);

  useEffect(() => {
    let tokenExpire = localStorage.getItem('gatTokenExp') ?? 0;

    if(tokenExpire < new Date().getTime()) {
      getToken();
    }
    fetchTeams();
  }, [getToken, fetchTeams]);

  return (
    <div>
      <AdminHeader />
      <ManageTeams teams={teams} />
    </div>
  );
};

export default AdminDashboard;