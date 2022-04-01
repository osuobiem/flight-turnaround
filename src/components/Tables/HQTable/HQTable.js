import { Table, Flex, Text, FlexItem } from "@fluentui/react-northstar";
import { ArrowDownIcon, ArrowUpIcon } from '@fluentui/react-icons-northstar'

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
        onClick: () => doSort(0),
        onMouseOver: () => toggleIcon(0),
        onMouseLeave: () => toggleIcon(0, false)
      },
      {
        key: "origin",
        title: "Origin",
        content: "Origin",
        className: headerClass,
        icon: 'arrowUp',
        'aria-sort': undefined,
        onClick: () => doSort(1),
        onMouseOver: () => toggleIcon(1),
        onMouseLeave: () => toggleIcon(1, false)
      },
      {
        key: "sta",
        title: "STA",
        content: "STA",
        className: headerClass,
        icon: 'arrowUp',
        'aria-sort': undefined,
        onClick: () => doSort(2),
        onMouseOver: () => toggleIcon(2),
        onMouseLeave: () => toggleIcon(2, false)
      },
      {
        key: "std",
        title: "STD",
        content: "STD",
        className: headerClass,
        icon: 'arrowUp',
        'aria-sort': undefined,
        onClick: () => doSort(3),
        onMouseOver: () => toggleIcon(3),
        onMouseLeave: () => toggleIcon(3, false)
      },
      {
        key: "status",
        title: "Status",
        content: "Status",
        className: headerClass,
        icon: 'arrowUp',
        'aria-sort': undefined,
        onClick: () => doSort(4),
        onMouseOver: () => toggleIcon(4),
        onMouseLeave: () => toggleIcon(4, false)
      },
      {
        key: "destination",
        title: "Destination",
        content: "Destination",
        className: headerClass,
        icon: 'arrowUp',
        'aria-sort': undefined,
        onClick: () => doSort(5),
        onMouseOver: () => toggleIcon(5),
        onMouseLeave: () => toggleIcon(5, false)
      },
      {
        key: "performance",
        title: "Perfomance",
        content: "Perfomance",
        className: headerClass,
        icon: 'arrowUp',
        'aria-sort': undefined,
        onClick: () => doSort(6),
        onMouseOver: () => toggleIcon(6),
        onMouseLeave: () => toggleIcon(6, false)
      },
      {
        key: "time-on-ground",
        title: "Time on Ground",
        content: "Time on Ground",
        className: headerClass,
        icon: 'arrowUp',
        'aria-sort': undefined,
        onClick: () => doSort(7),
        onMouseOver: () => toggleIcon(7),
        onMouseLeave: () => toggleIcon(7, false)
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

  // Compare sort values
  const compare = (key, order) => {
    return (a, b) => {
      if (order === 'asc') {
        if (a.items[key].content < b.items[key].content) return -1;
        if (a.items[key].content > b.items[key].content) return 1;
      }
      else {
        if (a.items[key].content > b.items[key].content) return -1;
        if (a.items[key].content < b.items[key].content) return 1;
      }
  
      return 0;
    }
  }

  // Custom sort item content
  const doSort = (key) => {
    let newHeader = { ...header };
    let order = newHeader.items[key]['aria-sort'] ?? 'asc';

    rows.sort(compare(key, order));

    order = order === 'asc' ? 'desc' : 'asc';

    newHeader.items[key].icon = order === 'asc' ? 'arrowDown' : 'arrowUp';
    newHeader.items[key]['aria-sort'] = order;
    
    setHeader(newHeader);
    toggleIcon(key);
  }

  // Toggle header cell icon onMouseOver and onMouseLeave
  const toggleIcon = (key, show = true) => {
    let newHeader = { ...header };
    let title = newHeader.items[key].title;

    if (show) {
      let icon = newHeader.items[key].icon;

      newHeader.items[key].content = icon === 'arrowUp' ? arrowUp(title) : arrowDown(title);
    }
    else {
      newHeader.items[key].content = title;
    }
    
    setHeader(newHeader);
  }

  // Add  ArrowUp icon to header cell content
  const arrowUp = (title) =>
    <Flex gap="gap.small">
      <FlexItem><Text content={title} /></FlexItem>
      <FlexItem><ArrowUpIcon /></FlexItem>
    </Flex>;

  // Add  ArrowDown icon to header cell content
  const arrowDown = (title) =>
    <Flex gap="gap.small">
      <FlexItem><Text content={title} /></FlexItem>
      <FlexItem><ArrowDownIcon /></FlexItem>
    </Flex>;

  return (
    <div className="tab-container">
      <Table compact header={header} rows={rows} className="hqt-table" />
    </div>
  );
};

export default HQTable;
