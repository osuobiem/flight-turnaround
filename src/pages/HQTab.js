import React from "react";
import HQTable from "../components/Tables/HQTable/HQTable";
import HQTabFilters from "../components/HQTabFilters/HQTabFilters";

const HQTab = () => {
  return (
    <div>
      <HQTabFilters></HQTabFilters>
      <HQTable />
    </div>
  );
};

export default HQTab;
