import React from 'react';
import Table from '../helpers/Table/Table';

const header = ['Flight Number', 'Origin', 'STA', 'STD', 'Status', 'Destination', 'Perfomance', 'Time on Ground'];

const rows = [
  {
    items: ['EA243', 'Abuja', '10:00', '12:00', 'Departed', 'Lagos', 'In - Time', '01:35']
  },
  {
    items: ['EA243', 'Abuja', '10:00', '12:00', 'Departed', 'Lagos', 'In - Time', '01:35']
  },
  {
    items: ['EA243', 'Abuja', '10:00', '12:00', 'Departed', 'Lagos', 'In - Time', '01:35']
  }
];

const HQTab = () => {
  return (
    <Table header={header} rows={rows} />
  );
};

export default HQTab;