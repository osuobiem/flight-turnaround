import { Table } from '@fluentui/react-northstar';
import moment from 'moment';

import './FlightDetails.css';

const CurrentStatus = ({ tab, flightActivities }) => {

  const header = {
    items: ['Task', 'Completed at', 'Updated by']
  };

  let rows = flightActivities.map((activity, i) => {
    return {
      key: i+1,
      items: [activity.Task, moment(activity.Timestamp).format('HH:mm'), activity.DoneBy]
    }
  });

  if(rows.length < 1) {
    rows = [{key: 1, items: ['No Task done yet']}]
  }

  return (
    <Table header={header} rows={rows} className={tab !== 'vwa' ? 'd-none' : 'vwa-table'}/>
  );
};

export default CurrentStatus;