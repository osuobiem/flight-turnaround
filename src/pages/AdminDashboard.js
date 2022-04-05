import React from "react";
import ManageTeams from "../components/Tables/ManageTeams/ManageTeams";
import AdminHeader from "../components/AdminHeader/AdminHeader";

const AdminDashboard = () => {
  return (
    <div>
        <AdminHeader />
        <ManageTeams />
    </div>
  );
};

export default AdminDashboard;
