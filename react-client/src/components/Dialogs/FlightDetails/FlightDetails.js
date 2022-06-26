import { Dialog, Menu, tabListBehavior } from '@fluentui/react-northstar';
import { CloseIcon } from '@fluentui/react-icons-northstar';

import CurrentStatus from './CurrentStatus';
import ViewActivity from './ViewActivity';
import TopCard from '../../TopCard';

import './FlightDetails.css';
import { useState, useCallback, useEffect } from 'react';

import logo from '../../../ftlogo.png';
import {api} from '../../../helpers/ApiHandler';
import {useContext} from 'react';
import {LoaderContext} from '../../../AppContext';

const FlightDetails = ({open, setOpen, flight, stations}) => {
    const {dispatchLoaderEvent} = useContext(LoaderContext);
    
    const [tab, setTab] = useState('crs');

    const getFlightDetails = useCallback(async (flightNumber) => {
        if(flightNumber !== undefined) {
            dispatchLoaderEvent(true);

            await api({
                url: 'flight-summary/'+flightNumber,
                method: 'get'
            })
            .then(res => {
                setFlightDetails(res.data.data);
                dispatchLoaderEvent(false);
            })
            .catch(err => {
                console.log(err);
                dispatchLoaderEvent(false);
            });
        }
    }, [setOpen, dispatchLoaderEvent]);

    const getFlightActivities = useCallback(async (flightNumber) => {
        if(flightNumber !== undefined) {
            dispatchLoaderEvent(true);

            await api({
                url: 'done-airport-activities/flight/'+flightNumber,
                method: 'get'
            })
            .then(res => {
                setFlightActivities(res.data.data);
                dispatchLoaderEvent(false);
            })
            .catch(err => {
                console.log(err);
                dispatchLoaderEvent(false);
            });
        }
    }, [setOpen, dispatchLoaderEvent]);

    const [flightDetails, setFlightDetails] = useState({});
    const [flightActivities, setFlightActivities] = useState([]);

    useEffect(() => {
        getFlightDetails(flight.FlightNumber);
        getFlightActivities(flight.FlightNumber);
    }, [flight, setFlightDetails, getFlightDetails, getFlightActivities]);

    return (
        <Dialog
            open={open}
            cancelButton="Close"
            onOpen={() => setOpen(true)}
            onCancel={() => {setTab('crs'); setOpen(false);}}
            header={<TopCard title={flight.FlightNumber} subTitle="Flight Turnaround Ramp" avatar={logo} />}
            headerAction={{
                icon: <CloseIcon />,
                title: 'Close',
                onClick: () => {setTab('crs'); setOpen(false);},
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
                                <CurrentStatus tab={tab} flight={flight} stations={stations} flightDetails={flightDetails} />
                                <ViewActivity tab={tab} flightActivities={flightActivities}/>
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