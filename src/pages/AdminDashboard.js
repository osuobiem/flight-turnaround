import React, {useState, useCallback} from "react";
import ManageTeams from "../components/Tables/ManageTeams/ManageTeams";
import AdminHeader from "../components/AdminHeader/AdminHeader";

import * as msTeams from '@microsoft/teams-js';
import {useEffect, useContext} from "react";
import {api} from "../helpers/ApiHandler";
import {StationsContext, LoaderContext} from '../AppContext';
msTeams.initialize();

const AdminDashboard = () => {
  const {dispatchLoaderEvent} = useContext(LoaderContext);

  const {stations} = useContext(StationsContext);
  const [flightStations, setFlightStations] = useState({});

  useEffect(() => {
    setFlightStations(stations);
  }, [stations]);

  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
    
  // Fetch Teams
  const fetchTeams = useCallback(async () => {
    dispatchLoaderEvent(true);
    await api('getTeams').then(res => {
      setTeams(res.data.data);
      dispatchLoaderEvent(false);
    });
  }, [setTeams, dispatchLoaderEvent]);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    dispatchLoaderEvent(true);
    await api('getUsers').then(res => {
      setUsers(res.data.data.value);
      dispatchLoaderEvent(false);
    });
  }, [setUsers, dispatchLoaderEvent]);

  const getToken = useCallback(async () => {
    dispatchLoaderEvent(true);
    let token = await new Promise((resolve, reject) => {
        msTeams.authentication.getAuthToken({
          successCallback: (result) => { console.log(result); resolve(result); },
            failureCallback: (error) => { dispatchLoaderEvent(false); console.log(error); reject(error); }
        });
    });

    let tokenExpire = (new Date().getTime()) + 3600000;

    await api('switchTokens', {}, {access_token: token}).then(() => {
      localStorage.setItem('gatTokenExp', tokenExpire.toString()); 
      dispatchLoaderEvent(true);
    });
  }, [dispatchLoaderEvent]);

  useEffect(() => {
    let tokenExpire = localStorage.getItem('gatTokenExp') ?? 0;

    if(tokenExpire < new Date().getTime()) {
      getToken();
    }
    fetchTeams();
    fetchUsers();
  }, [getToken, fetchTeams, fetchUsers]);

  return (
    <div>
      <AdminHeader users={users} fetchTeams={fetchTeams} stations={flightStations} teams={teams} setTeams={setTeams}/>
      <ManageTeams teams={teams} users={users} fetchTeams={fetchTeams} stations={flightStations} />
    </div>
  );
};

export default AdminDashboard;