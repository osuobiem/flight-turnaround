import { Table } from "@fluentui/react-northstar";
import TableSort from "../../../helpers/TableSort";

import "./HQTable.css";

import HQTableMenu from "../../HQTableMenu/HQTableMenu";
import { useState } from "react";

const HQTable = () => {

  const headerClass = 'hqt-header';
  const [header, setHeader] = useState({
    items: [
      {
        key: "flight-number",
        title: "Flight Number",
        content: "Flight Number",
        className: `${headerClass} hqt-left-padding`,
        icon: 'arrowUp',
        'aria-sort': undefined,
        onClick: () => tableSort.doSort(0),
        onMouseOver: () => tableSort.toggleIcon(0),
        onMouseLeave: () => tableSort.toggleIcon(0, false)
      },
      {
        key: "origin",
        title: "Origin",
        content: "Origin",
        className: headerClass,
        icon: 'arrowUp',
        'aria-sort': undefined,
        onClick: () => tableSort.doSort(1),
        onMouseOver: () => tableSort.toggleIcon(1),
        onMouseLeave: () => tableSort.toggleIcon(1, false)
      },
      {
        key: "sta",
        title: "STA",
        content: "STA",
        className: headerClass,
        icon: 'arrowUp',
        'aria-sort': undefined,
        onClick: () => tableSort.doSort(2),
        onMouseOver: () => tableSort.toggleIcon(2),
        onMouseLeave: () => tableSort.toggleIcon(2, false)
      },
      {
        key: "std",
        title: "STD",
        content: "STD",
        className: headerClass,
        icon: 'arrowUp',
        'aria-sort': undefined,
        onClick: () => tableSort.doSort(3),
        onMouseOver: () => tableSort.toggleIcon(3),
        onMouseLeave: () => tableSort.toggleIcon(3, false)
      },
      {
        key: "status",
        title: "Status",
        content: "Status",
        className: headerClass,
        icon: 'arrowUp',
        'aria-sort': undefined,
        onClick: () => tableSort.doSort(4),
        onMouseOver: () => tableSort.toggleIcon(4),
        onMouseLeave: () => tableSort.toggleIcon(4, false)
      },
      {
        key: "destination",
        title: "Destination",
        content: "Destination",
        className: headerClass,
        icon: 'arrowUp',
        'aria-sort': undefined,
        onClick: () => tableSort.doSort(5),
        onMouseOver: () => tableSort.toggleIcon(5),
        onMouseLeave: () => tableSort.toggleIcon(5, false)
      },
      {
        key: "performance",
        title: "Perfomance",
        content: "Perfomance",
        className: headerClass,
        icon: 'arrowUp',
        'aria-sort': undefined,
        onClick: () => tableSort.doSort(6),
        onMouseOver: () => tableSort.toggleIcon(6),
        onMouseLeave: () => tableSort.toggleIcon(6, false)
      },
      {
        key: "time-on-ground",
        title: "Time on Ground",
        content: "Time on Ground",
        className: headerClass,
        icon: 'arrowUp',
        'aria-sort': undefined,
        onClick: () => tableSort.doSort(7),
        onMouseOver: () => tableSort.toggleIcon(7),
        onMouseLeave: () => tableSort.toggleIcon(7, false)
      },
      { key: "more options", "aria-label": "options", className: headerClass },
    ],
  });
  
  const [rows] = useState([
    {
      key: 1,
      items: [
        { key: "1-1", content: "EC143", className: "hqt-left-padding" },
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
        { key: "2-2", content: "Lagos" },
        { key: "2-3", content: "01:40" },
        { key: "2-4", content: "12:00" },
        { key: "2-5", content: "Arrived" },
        { key: "2-6", content: "Abuja" },
        { key: "2-7", content: "Delayed", className: "hqt-negative" },
        { key: "2-8", content: "01:35" },
        { key: "2-9", content: <HQTableMenu/> },
      ],
    },
  ]);

  const tableSort = new TableSort(header, rows, setHeader);

  return (
    <div className="tab-container">
      <Table compact header={header} rows={rows} className="hqt-table" />
    </div>
  );
};

export default HQTable;
