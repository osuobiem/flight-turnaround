import { Grid, Flex, Text } from '@fluentui/react-northstar';

import './FlightDetails.css';

const CurrentStatus = ({tab, flight}) => {
    
    const content = [
        <Flex column className="crs-item">
            <Text content="Flight Date" weight="bold" size="small" className="crs-label" />
            <Text content={flight.Timestamp.split('T')[0]} size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item">
            <Text content="Flight Number" weight="bold" size="small" className="crs-label" />
            <Text content={flight.FlightNumber} size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item">
            <Text content="Arriving From" weight="bold" size="small" className="crs-label" />
            <Text content={flight.Origin} size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item">
            <Text content="Departing To" weight="bold" size="small" className="crs-label" />
            <Text content={flight.Destination} size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item">
            <Text content="STA" weight="bold" size="small" className="crs-label" />
            <Text content={`${(new Date(flight.STA)).getHours()}:${(new Date(flight.STA)).getMinutes()}`} size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item">
            <Text content="STD" weight="bold" size="small" className="crs-label" />
            <Text content={`${(new Date(flight.STD)).getHours()}:${(new Date(flight.STD)).getMinutes()}`} size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item">
            <Text content="Status" weight="bold" size="small" className="crs-label" />
            <Text content={flight.Status} size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item">
            <Text content="Last Updated" weight="bold" size="small" className="crs-label" />
            <Text content={flight.Timestamp.split('T')[0]} size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item">
            <Text content="Updated by" weight="bold" size="small" className="crs-label" />
            <Text content="Tolu Adeniran" size="medium" weight="light" />
        </Flex>
    ];

    return (
        <Grid content={content} columns={3} className={tab !== 'crs' ? 'd-none' : null} />
    )
};

export default CurrentStatus;