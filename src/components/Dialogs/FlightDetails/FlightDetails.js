import { Dialog, Avatar, Card, Flex, Text, Menu, tabListBehavior } from '@fluentui/react-northstar';
import { CloseIcon } from '@fluentui/react-icons-northstar';

import CurrentStatus from './CurrentStatus';
import ViewActivity from './ViewActivity';

import './FlightDetails.css';
import { useState } from 'react';

const FlightDetails = ({open, setOpen}) => {
    
    const [tab, setTab] = useState('crs');

    const topCard = (
        <Card aria-roledescription="card avatar" compact ghost>
            <Card.Header fitted>
                <Flex gap="gap.small">
                    <Avatar
                        image="https://images.unsplash.com/photo-1531642765602-5cae8bbbf285?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGxhbmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
                        label="EA2635" name="EA2635" square className="fld-header-img" />
                    <Flex column>
                    <Text content="EA2635" weight="bold" size="medium" />
                    <Text content="Green Africa Ramp" size="small" weight="light" color="grey" />
                    </Flex>
                </Flex>
            </Card.Header>
        </Card>
    );

    return (
        <Dialog
            open={open}
            cancelButton="Close"
            onOpen={() => setOpen(true)}
            onCancel={() => setOpen(false)}
            header={topCard}
            headerAction={{
                icon: <CloseIcon />,
                title: 'Close',
                onClick: () => setOpen(false),
            }}
            footer={{
                children: (Component, props) => {
                    const { styles, ...rest } = props
                    return (
                        <div>
                            <Menu
                                defaultActiveIndex={0}
                                items={[
                                    { key: 'current-status', content: 'Current Status', onClick: () => setTab('crs') },
                                    { key: 'view-activity', content: 'View Activity', onClick: () => setTab('vwa') }
                                ]}
                                underlined primary accessibility={tabListBehavior}
                                className="fld-menu"
                            />

                            <div className="fld-content">
                                <CurrentStatus tab={tab}/>
                                <ViewActivity tab={tab}/>
                            </div>

                            <Component {...rest} />
                        </div>
                    )
                },
            }}
        />
    )
};

export default FlightDetails;