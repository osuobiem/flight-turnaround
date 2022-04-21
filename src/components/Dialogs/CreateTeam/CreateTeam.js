import { Dialog, CloseIcon, Input, FormDropdown } from "@fluentui/react-northstar";
import { useState } from "react";
import {api, graphApi} from "../../../helpers/ApiHandler";
import TopCard from "../../../helpers/TopCard";
import ErrorAlert from "../../AlertsMessage/ErrorAlert";

import "./CreateTeam.css";

const CreateTeam = ({ open, setOpen, people, fetchTeams }) => {

    const [openD2, setOpenD2] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [apLocation, setApLocation] = useState({header: 'Abuja', content: 'ABV'});
    const [zone, setZone] = useState('North');
    const [team, setTeam] = useState({});

    const [tcoMembers, setTcoMembers] = useState([]);
    const [dutyManagers, setManagers] = useState([]);

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const title = "Create New Airport Flight Ops Team"
    const subTitle = "GA Turnaround";
    const avatar = "https://images.unsplash.com/photo-1531642765602-5cae8bbbf285";

    const terminals = [
        {header: 'Abuja', content: 'ABV'},
        {header: 'Lagos', content: 'LOS'},
        {header: 'Jos', content: 'JOS'},
        {header: 'Port Harcourt', content: 'PHC'},
        {header: 'Uyo', content: 'QUO'},
        {header: 'Owerri', content: 'QOW'}
    ];
    const zones = ['West', 'North', 'South', 'East'];

    const errorAlert = (show, message) => {
        message = message.replaceAll('Channel.DisplayName', 'Team Name');
        message = message.replaceAll('channel.displayName', 'Team Name');
        message = message.replaceAll('Channel name', 'Team Name');
        message = message.replaceAll('channel name', 'Team Name');

        setErrorMessage(message);
        setShowError(show);
        
        setTimeout(() => {
            setShowError(false);
        }, 5000);
    }

    // Create channel in Teams and Node Server
    const createChannel = async () => {

        if (Object.entries(team).length > 0) {
            setOpen(false); setOpenD2(true);
        }
        else {
            let data = {
                'description': `${teamName} | ${apLocation.header} | ${zone}`,
                'displayName': teamName,
                'membershipType': 'private'
            };
            setOpen(false); setOpenD2(true);
            
            await graphApi('createChannel', {}, data)
                .then(res => {
                    setTeam(res.data.data);
                    setOpen(false); setOpenD2(true);
                })
                .catch(err => {
                    let error = err?.message;

                    if (err.response) error = err.response?.data?.message?.error?.message;
                    else if (err.request) error = err?.request;
    
                    errorAlert(true, error.length > 0 ? error : 'An unknown error occured!');
                });
        }
    }

    const saveChannel = async () => {
        // Add People to Channel
        await graphApi({
            url: `graph/channels/${team?.id}/members`,
            method: 'post'
        }, {}, {
            add: [
                ...tcoMembers.map(m => { return {id: m.id, role: 'member'}}),
                ...dutyManagers.map(m => { return {id: m.id, role: 'owner'}})
            ]
        })
        .then(() => saveTeamToDb())
        .catch(err => {
            let error = err?.message;

            if (err.response) error = err.response?.data?.message?.error?.message;
            else if (err.request) error = err?.request;

            errorAlert(true, error.length > 0 ? error : 'An unknown error occured!');
        });
    }

    // Save team to DB
    const saveTeamToDb = async () => {
        let data = {
            name: teamName,
            location: apLocation.header,
            location_short: apLocation.content,
            zone: zone,
            channel_id: team?.id,
            tcos: [...tcoMembers.map(m => m.id)],
            duty_mgs: [...dutyManagers.map(m => m.id)]
        };

        await api('createTeam', {}, data)
        .then(async () => {
            await fetchTeams();

            setOpenD2(false);

            setManagers([]);
            setTcoMembers([]);
        })
        .catch(async err => {
            await graphApi({
                url: `graph/channels/${team?.id}`,
                method: 'delete'
            });

            let error = err?.message;

            if (err.response) error = err.response?.data?.message?.error?.message;
            else if (err.request) error = err?.request;

            errorAlert(true, error.length > 0 ? error : 'An unknown error occured!');
        });
    }
    
    const peopleList = people.map(p => {
        return {header: p.displayName, content: p.jobTitle, id: p.id}
    });

    // Pick people from dropdown
    const pickPeople = (value, type) => {
        if (type === 'member') setTcoMembers(value);
        else setManagers(value);
    }

    return (
        <div>
            {/* First Page */}
            <Dialog
                open={open}
                cancelButton="Close"
                confirmButton="Next"
                onConfirm={() => createChannel() }
                onCancel={() => setOpen(false)}
                header={<TopCard title={title} subTitle={subTitle} avatar={avatar} />}
                headerAction={{
                    icon: <CloseIcon />,
                    title: 'Close',
                    onClick: () => setOpen(false),
                }}
                footer={{
                    children: (Component, props) => {
                        const { styles, ...rest } = props;
                        return (
                            <div className="tf-content">

                                <ErrorAlert show={showError} message={errorMessage} />

                                <Input
                                    label={{ content: "Flight Ops Team Name", htmlFor: "flight-ops-team-name" }}
                                    placeholder="Flight Ops Team Name"
                                    name="flightOpsTeamName"
                                    id="flight-ops-team-name"
                                    required fluid
                                    showSuccessIndicator={false}
                                    defaultValue={teamName}
                                    onKeyUp={e => setTeamName(e.target.value)}
                                />

                                <FormDropdown
                                    label="Airport Location"
                                    items={terminals}
                                    defaultValue={apLocation}
                                    onChange={(ev, op) => setApLocation(op.value)}
                                    fluid
                                />

                                <FormDropdown
                                    label="Zone"
                                    items={zones}
                                    defaultValue={zone}
                                    onChange={(ev, op) => setZone(op.value)}
                                    fluid
                                />

                                <Component {...rest} />
                            </div>
                        );
                    },
                }}
            />

            {/* Second Page */}
            <Dialog
                open={openD2}
                cancelButton="Back"
                confirmButton="Save"
                onCancel={() => { setOpenD2(false); setOpen(true); }}
                onConfirm={() => saveChannel()}
                header={<TopCard title={title} subTitle={subTitle} avatar={avatar} />}
                headerAction={{
                    icon: <CloseIcon className="d2-icon" />,
                    title: 'Close',
                    onClick: () => setOpen(false),
                }}
                footer={{
                    children: (Component, props) => {
                        const { styles, ...rest } = props;
                        return (
                            <div className="tf-content">
                                
                                <ErrorAlert show={showError} message={errorMessage} />

                                <FormDropdown
                                    search multiple
                                    label="Choose TCO members"
                                    items={peopleList} fluid
                                    defaultValue={tcoMembers}
                                    placeholder="Start typing a name"
                                    noResultsMessage="We did't find any matches."
                                    a11ySelectedItemsMessage="Press Delete or Backspace to remove"
                                    onChange={(ev, op) => pickPeople(op.value, 'member')}
                                    className="tf-people"/>
                                
                                <FormDropdown
                                    search multiple
                                    label="Choose Duty managers"
                                    items={peopleList} fluid
                                    defaultValue={dutyManagers}
                                    placeholder="Start typing a name"
                                    noResultsMessage="We did't find any matches."
                                    a11ySelectedItemsMessage="Press Delete or Backspace to remove"
                                    onChange={(ev, op) => pickPeople(op.value, 'manager')}
                                    className="tf-people tf-dm"/>

                                <Component {...rest} />
                            </div>
                        );
                    },
                }}
            />
        </div>
    );
};

export default CreateTeam;