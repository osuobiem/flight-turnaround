import React, { useContext } from "react";
import ManageTeams from "../components/Tables/ManageTeams/ManageTeams";
import AdminHeader from "../components/AdminHeader/AdminHeader";

import { serverReq } from "../helpers/ServerHelper";
import { AuthContext } from "../AppContext";
import { useEffect } from "react";

const AdminDashboard = () => {
  const { dispatchAuthEvent } = useContext(AuthContext);

  useEffect(() => {
    const accessToken = async () => {
      dispatchAuthEvent(await serverReq('getToken'));
    }
    
    accessToken();
  }, []);

  return (
    <div>
        <AdminHeader />
        <ManageTeams />
    </div>
  );
};

export default AdminDashboard;
