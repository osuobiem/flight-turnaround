import { Table, Button } from "@fluentui/react-northstar";
import TableSort from "../../../helpers/TableSort";
import FlightDetails from '../../Dialogs/FlightDetails/FlightDetails';

import "./HQTable.css";
import { useMemo, useState, useEffect } from "react";

const HQTable = ({flights}) => {
  const [showFlightDetails, setShowFlightDetails] = useState(false);
  const [activeFlight, setActiveFlight] = useState({});

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
  
  const tableSort = useMemo(() => new TableSort(header, setHeader), [header]);
  const [rows, setRows] = useState([]);
  
  useEffect(() => {
    
    let tRows = flights.map((flight, i) => {
      return {
        key: i,
        items: [
          { key: `${i}-1`, content: flight.FlightNumber, className: "hqt-left-padding" },
          { key: `${i}-2`, content: flight.Origin },
          { key: `${i}-3`, content: `${(new Date(flight.STA)).getHours()}:${(new Date(flight.STA)).getMinutes()}` },
          { key: `${i}-4`, content: `${(new Date(flight.STD)).getHours()}:${(new Date(flight.STD)).getMinutes()}` },
          { key: `${i}-5`, content: flight.Status, className: statusColor(flight.Status) },
          { key: `${i}-6`, content: flight.Destination },
          { key: `${i}-7`, content: flight.Performance, className: statusColor(flight.Performance) },
          { key: `${i}-8`, content: flight.TimeOnGround },
          { key: `${i}-9`, content: <Button content="View" tinted size="small" onClick={() => {setActiveFlight(flight); setShowFlightDetails(true)}} /> }
        ]
      }
    });

    setRows(tRows);
  }, [flights]);

  useEffect(() => {
    tableSort.setRows(rows);
  }, [rows, tableSort]);

  const statusColor = status => {
    let positive = ['Departed', 'In - Time'];
    let negative = ['Delayed'];

    if(positive.includes(status)) {
      return 'hqt-positive'; 
    }
    else if(negative.includes(status)) {
      return 'hqt-negartive';
    };

    return '';
  };

  return (
    <div className="tab-container">
      <Table compact header={header} rows={rows} className="hqt-table" />

      <FlightDetails flight={activeFlight} open={showFlightDetails} setOpen={setShowFlightDetails} />
    </div>
  );
};

export default HQTable;
