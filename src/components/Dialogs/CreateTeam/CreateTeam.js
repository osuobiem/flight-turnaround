import { Dialog, CloseIcon, Input, FormDropdown } from "@fluentui/react-northstar";
import { useState, useContext } from "react";
import {api, graphApi} from "../../../helpers/ApiHandler";
import TopCard from "../../TopCard";
import ErrorAlert from "../../AlertsMessage/ErrorAlert";

import avatar from '../../../galogo.png';

import "./CreateTeam.css";
import {LoaderContext} from "../../../AppContext";

const CreateTeam = ({ open, setOpen, users, fetchTeams, stations }) => {

    const {dispatchLoaderEvent} = useContext(LoaderContext)

    const [openD2, setOpenD2] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [apLocation, setApLocation] = useState({header: 'Abuja International Airport', content: 'ABV'});
    const [zone, setZone] = useState('North');
    const [team, setTeam] = useState({});

    const [tcoMembers, setTcoMembers] = useState([]);
    const [dutyManagers, setManagers] = useState([]);
    const [dutyOfficers, setOfficers] = useState([]);

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const title = "Create New Airport Flight Ops Team"
    const subTitle = "GA Turnaround";

    let terminals = [];

    for (const key in stations) {
        terminals.push({header: stations[key], content: key});
    }
    const zones = ['East', 'North', 'South', 'West'];

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

    // Create team in Teams and Node Server
    const createTeam = async () => {

        if (Object.entries(team).length > 0) {
            setOpen(false); setOpenD2(true);
        }
        else {
            dispatchLoaderEvent(true);

            let data = {
                "template@odata.bind": "https://graph.microsoft.com/v1.0/teamsTemplates('standard')",
                description: `${teamName} | ${apLocation.header} | ${zone}`,
                displayName: teamName,
                visibility: 0
            };
            setOpen(false); setOpenD2(true);
            
            await graphApi('createTeam', {}, data)
                .then(res => {
                    setTeam(res.data.data);
                    setOpen(false); setOpenD2(true);
                    dispatchLoaderEvent(false);
                })
                .catch(err => {
                    let error = err?.message;

                    if (err.response) error = err.response?.data?.message?.error?.message;
                    else if (err.request) error = err?.request;

                    dispatchLoaderEvent(false);
    
                    errorAlert(true, error.length > 0 ? error : 'An unknown error occured!');
                    setOpenD2(false); setOpen(true);
                });
        }
    }

    const saveTeam = async () => {
        dispatchLoaderEvent(true);

        // Add People to Channel
        await graphApi({
            url: `graph/teams/${team.teamId}/members`,
            method: 'post'
        }, {}, {
            add: [
                ...tcoMembers.map(m => { return {id: m.id, role: 'member'}}),
                ...dutyManagers.map(m => { return {id: m.id, role: 'owner'}}),
                ...dutyOfficers.map(m => { return {id: m.id, role: 'member'}})
            ]
        })
        .then(() => saveTeamToDb())
        .catch(err => {
            let error = err?.message;

            if (err.response) error = err.response?.data?.message?.error?.message;
            else if (err.request) error = err?.request;

            dispatchLoaderEvent(true);

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
            ChannelID: team.channelId,
            TeamID: team.teamId,
            tcos: [...tcoMembers.map(m => m.id)],
            duty_mgs: [...dutyManagers.map(m => m.id)],
            duty_officers: [...dutyOfficers.map(m => m.id)]
        };

        await api('createAirportTeam', {}, data)
        .then(async () => {
            await fetchTeams();

            setOpenD2(false);

            setManagers([]);
            setTcoMembers([]);
            setOfficers([]);
            setTeam({});
            setTeamName('');

            dispatchLoaderEvent(false);
        })
        .catch(async err => {
            await graphApi({
                url: `graph/groups/${team.teamId}`,
                method: 'delete'
            });

            let error = err?.message;

            if (err.response) error = err.response?.data?.message?.error?.message;
            else if (err.request) error = err?.request;

            dispatchLoaderEvent(false);

            errorAlert(true, error.length > 0 ? error : 'An unknown error occured!');
        });
    }
    
    const peopleList = users.map(p => {
        return {header: p.displayName, content: p.jobTitle, id: p.id}
    });

    // Pick people from dropdown
    const pickPeople = (value, type) => {
        if (type === 'member') setTcoMembers(value);
        else if(type === 'officer') setOfficers(value);
        else setManagers(value);
    }

    return (
        <div>
            {/* First Page */}
            <Dialog
                open={open}
                cancelButton="Close"
                confirmButton="Next"
                onConfirm={() => createTeam() }
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
                onConfirm={() => saveTeam()}
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
                                    label="Choose Duty officers"
                                    items={peopleList} fluid
                                    defaultValue={dutyOfficers}
                                    placeholder="Start typing a name"
                                    noResultsMessage="We did't find any matches."
                                    a11ySelectedItemsMessage="Press Delete or Backspace to remove"
                                    onChange={(ev, op) => pickPeople(op.value, 'officer')}
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