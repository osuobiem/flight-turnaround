import { Grid, Flex, Text } from '@fluentui/react-northstar';

import './FlightDetails.css';

const CurrentStatus = ({tab}) => {
    
    const content = [
        <Flex column className="crs-item">
            <Text content="Flight Date" weight="bold" size="small" className="crs-label" />
            <Text content="20/05/2021" size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item">
            <Text content="Flight Number" weight="bold" size="small" className="crs-label" />
            <Text content="EA2635" size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item">
            <Text content="Arriving From" weight="bold" size="small" className="crs-label" />
            <Text content="Lagos" size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item">
            <Text content="Departing To" weight="bold" size="small" className="crs-label" />
            <Text content="Abuja" size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item">
            <Text content="STA" weight="bold" size="small" className="crs-label" />
            <Text content="13:00" size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item">
            <Text content="STD" weight="bold" size="small" className="crs-label" />
            <Text content="14:00" size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item">
            <Text content="Status" weight="bold" size="small" className="crs-label" />
            <Text content="Boarding Close" size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item">
            <Text content="Last Updated" weight="bold" size="small" className="crs-label" />
            <Text content="14:35, 14 Jan 21" size="medium" weight="light" />
        </Flex>,
        <Flex column className="crs-item">
            <Text content="Updated by" weight="bold" size="small" className="crs-label" />
            <Text content="Shridhar" size="medium" weight="light" />
        </Flex>
    ];

    return (
        <Grid content={content} columns={3} className={tab !== 'crs' ? 'd-none' : null} />
    )
};

export default CurrentStatus;