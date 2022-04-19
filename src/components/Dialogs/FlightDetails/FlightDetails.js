import { Dialog, Menu, tabListBehavior } from '@fluentui/react-northstar';
import { CloseIcon } from '@fluentui/react-icons-northstar';

import CurrentStatus from './CurrentStatus';
import ViewActivity from './ViewActivity';
import TopCard from '../../../helpers/TopCard';

import './FlightDetails.css';
import { useState } from 'react';

const FlightDetails = ({open, setOpen, flight}) => {
    
    const [tab, setTab] = useState('crs');

    return (
        <Dialog
            open={open}
            cancelButton="Close"
            onOpen={() => setOpen(true)}
            onCancel={() => setOpen(false)}
            header={<TopCard title={flight.FlightNumber} subTitle="Green Africa Ramp" avatar="https://images.unsplash.com/photo-1531642765602-5cae8bbbf285" />}
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
                                <CurrentStatus tab={tab} flight={flight}/>
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