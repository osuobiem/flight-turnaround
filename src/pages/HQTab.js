import React from "react";
import HQTable from "../components/Tables/HQTable/HQTable";
import Filters from "../components/Filters/Filters";

const HQTab = () => {
  return (
    <div>
      <Filters></Filters>
      <HQTable />
    </div>
  );
};

export default HQTab;
