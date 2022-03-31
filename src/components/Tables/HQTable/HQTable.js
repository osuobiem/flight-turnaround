import { Table } from "@fluentui/react-northstar";

import FlightDetails from "../../Dialogs/FlightDetails/FlightDetails";

import "./HQTable.css";

import HQTableMenu from "../../Menus/HQTableMenu/HQTableMenu";

const HQTable = () => {

  const headerClass = 'hqt-header';
  const header = {
    items: [
      { key: "flight-number", content: "Flight Number", className: `${headerClass} hqt-left-padding` },
      { key: "origin", content: "Origin", className: headerClass },
      { key: "sta", content: "STA", className: headerClass },
      { key: "std", content: "STD", className: headerClass },
      { key: "status", content: "Status", className: headerClass },
      { key: "destination", content: "Destination", className: headerClass },
      { key: "performance", content: "Perfomance", className: headerClass },
      { key: "time-on-ground", content: "Time on Ground", className: headerClass },
      { key: "more options", "aria-label": "options", className: headerClass },
    ],
  };

  const rows = [
    {
      key: 1,
      items: [
        { key: "1-1", content: "EA243", className: "hqt-left-padding" },
        { key: "1-2", content: "Abuja" },
        { key: "1-3", content: "10:00" },
        { key: "1-4", content: "12:00" },
        { key: "1-5", content: "Departed", className: "hqt-positive" },
        { key: "1-6", content: "Lagos" },
        { key: "1-7", content: "In - Time", className: "hqt-positive" },
        { key: "1-8", content: "01:35" },
        { key: "1-9", content: <HQTableMenu/> },
      ],
    },
    {
      key: 2,
      items: [
        { key: "2-1", content: "EA243", className: "hqt-left-padding" },
        { key: "2-2", content: "Abuja" },
        { key: "2-3", content: "10:00" },
        { key: "2-4", content: "12:00" },
        { key: "2-5", content: "Arrived" },
        { key: "2-6", content: "Lagos" },
        { key: "2-7", content: "Delayed", className: "hqt-negative" },
        { key: "2-8", content: "01:35" },
        { key: "2-9", content: <HQTableMenu/> },
      ],
    },
  ];

  return (
    <div className="tab-container">
      <Table compact header={header} rows={rows} className="hqt-table" />
      <FlightDetails />
    </div>
  );
};

export default HQTable;
