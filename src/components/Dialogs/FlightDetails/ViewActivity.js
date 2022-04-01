import { Table } from '@fluentui/react-northstar';

import './FlightDetails.css';

const CurrentStatus = ({ tab }) => {

  const header = {
    items: ['Task', 'Completed at', 'Updated by']
  };

  const rows = [
    {
      key: 1,
      items: ['ON Ground', '12:00', 'Joseph'],
    },
    {
      key: 2,
      items: ['INTO Gate', '14:34', 'Olayinka'],
    },
    {
      key: 3,
      items: ['GPU/ACU Couple', '16:10', 'Chioma'],
    },
    {
      key: 4,
      items: ['ON Ground', '12:00', 'Joseph'],
    },
    {
      key: 5,
      items: ['INTO Gate', '14:34', 'Olayinka'],
    },
    {
      key: 6,
      items: ['GPU/ACU Couple', '16:10', 'Chioma'],
    }
  ];

  return (
    <Table header={header} rows={rows} className={tab !== 'vwa' ? 'd-none' : 'vwa-table'}/>
  );
};

export default CurrentStatus;