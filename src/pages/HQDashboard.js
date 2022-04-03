import React from "react";
import HQTable from "../components/Tables/HQTable/HQTable";
import HQTabFilters from "../components/HQTabFilters/HQTabFilters";

const HQDashboard = () => {
  return (
    <div>
      <HQTabFilters></HQTabFilters>
      <HQTable />
    </div>
  );
};

export default HQDashboard;
