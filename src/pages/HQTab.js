import React from 'react';
import { Table, Button } from '@fluentui/react-northstar';
import { MoreIcon } from '@fluentui/react-icons-northstar'
import {
  gridCellWithFocusableElementBehavior,
} from '@fluentui/accessibility'

const moreOptionCell = {
  content: <Button tabIndex={-1} icon={<MoreIcon />} circular text iconOnly title="More options" />,
  accessibility: gridCellWithFocusableElementBehavior,
  onClick: e => {
    alert('more option button clicked')
    e.stopPropagation()
  },
}

const header = {
  items: [
    {
      key: 'flight-number',
      content: 'Flight Number'
    },
    {
      key: 'origin',
      content: 'Origin'
    },
    {
      key: 'sta',
      content: 'STA'
    },
    {
      key: 'std',
      content: 'STD'
    },
    {
      key: 'status',
      content: 'Status'
    },
    {
      key: 'destination',
      content: 'Destination'
    },
    {
      key: 'performance',
      content: 'Perfomance'
    },
    {
      key: 'time-on-ground',
      content: 'Time on Ground'
    },
    {
      key: 'more options',
      'aria-label': 'options',
    }
  ]
};

const rows = [
  {
    key: 1,
    items: [
      { key: '1-1', content: 'EA243' },
      { key: '1-2', content: 'Abuja' },
      { key: '1-3', content: '10:00' },
      { key: '1-4', content: '12:00' },
      { key: '1-5', content: 'Departed' },
      { key: '1-6', content: 'Lagos' },
      { key: '1-7', content: 'In - Time' },
      { key: '1-8', content: '01:35' },
      { key: '1-9', ...moreOptionCell }
    ]
  },
];

const HQTab = () => {
  return (
    <Table header={header} rows={rows}/>
  );
};

export default HQTab;