import { Grid, Flex, Text } from '@fluentui/react-northstar';

import moment from 'moment';
import './FlightDetails.css';

const CurrentStatus = ({tab, flight, stations, flightDetails}) => {
    
    const content = [
        <Flex column className="crs-item" key="0">
            <Text content="Flight Date" weight="bold" size="small" className="crs-label" />
            <Text content={moment(flightDetails.flight_date).format('YYYY-MM-D')} size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item" key="1">
            <Text content="Flight Number" weight="bold" size="small" className="crs-label" />
            <Text content={flight.FlightNumber} size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item" key="2">
            <Text content="Arriving From" weight="bold" size="small" className="crs-label" />
            <Text content={`${flight.Origin} - ${stations[flight.Origin]}`} size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item" key="3">
            <Text content="Departing To" weight="bold" size="small" className="crs-label" />
            <Text content={`${flight.Destination} - ${stations[flight.Destination]}`} size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item" key="4">
            <Text content="STA" weight="bold" size="small" className="crs-label" />
            <Text content={moment(flight.STA).format('HH:mm')} size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item" key="5">
            <Text content="STD" weight="bold" size="small" className="crs-label" />
            <Text content={moment(flight.STD).format('HH:mm')} size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item" key="6">
            <Text content="Status" weight="bold" size="small" className="crs-label" />
            <Text content={flightDetails.stage} size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item" key="7">
            <Text content="Last Updated" weight="bold" size="small" className="crs-label" />
            <Text content={
                flightDetails.lastUpdateAt === 'N/A' ? 'N/A' :
                moment(flightDetails.lastUpdateAt).format('YYYY-MM-D [at] HH:mm')
                } size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item" key="8">
            <Text content="Updated by" weight="bold" size="small" className="crs-label" />
            <Text content={flightDetails.lastUpdatedBy} size="medium" weight="light" />
        </Flex>
    ];

    return (
        <Grid content={content} columns={3} className={tab !== 'crs' ? 'd-none' : null} />
    )
};

export default CurrentStatus;