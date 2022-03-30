import React from "react";
import HQTable from "../helpers/HQTable/HQTable";
import Filters from "../helpers/HQTable/Filters";

const HQTab = () => {
  return (
    <div>
      <Filters></Filters>
      <HQTable />
    </div>
  );
};

export default HQTab;
