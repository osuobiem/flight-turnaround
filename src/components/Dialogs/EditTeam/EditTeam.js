import { Dialog, CloseIcon, Input, FormDropdown } from "@fluentui/react-northstar";
import { useState, useContext } from "react";
import {api, graphApi} from "../../../helpers/ApiHandler";
import TopCard from "../../TopCard";
import ErrorAlert from "../../AlertsMessage/ErrorAlert";

import avatar from '../../../galogo.png';

import "./EditTeam.css";
import {LoaderContext} from "../../../AppContext";
import {useEffect, useCallback} from "react";

const CreateTeam = ({ team, open, setOpen, users, fetchTeams, stations }) => {

    const {dispatchLoaderEvent} = useContext(LoaderContext)

    const [openD2, setOpenD2] = useState(false);
    const [teamName, setTeamName] = useState(team.TeamName);
    const [apLocation, setApLocation] = useState({header: team.Location, content: team.LocationShort});
    const [zone, setZone] = useState(team.Zone);
    const [teamMembers, setTeamMembers] = useState([]);

    const [removeUsers, setRemoveUsers] = useState([]);
    const [tcoMembers, setTcoMembers] = useState([]);
    const [dutyManagers, setManagers] = useState([]);

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchTeamUsers = useCallback(async () => {
        dispatchLoaderEvent(true);

        await graphApi({
            url: `graph/teams/${team.TeamID}/members`,
            method: 'get'
        })
        .then(res => {
            setTeamMembers(res.data.data);

            let managers = [];
            let members = [];

            [...res.data.data].forEach(tm => {
                if(tm.roles.length > 0 && tm.roles.includes('owner')) {
                    managers.push(tm.userId);
                }
                else {
                    members.push(tm.userId);
                }
            });

            setTcoMembers(members);
            setManagers(managers);

            dispatchLoaderEvent(false);
        })
        .catch(async err => {
            let error = err?.message;

            if (err.response) error = err.response?.data?.message?.error?.message;
            else if (err.request) error = err?.request;

            dispatchLoaderEvent(false);

            errorAlert(true, error.length > 0 ? error : 'An unknown error occured!');
        });
    }, [dispatchLoaderEvent, team]);

    useEffect(()=>{
        fetchTeamUsers();
    }, [fetchTeamUsers]);

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

    // Update team in Teams and Node Server
    const updateTeam = async () => {
        dispatchLoaderEvent(true);

        let data = {
            description: `${teamName} | ${apLocation.header} | ${zone}`,
            displayName: teamName
        };
        setOpen(false); setOpenD2(true);
        
        await await graphApi({
            url: `graph/teams/${team.TeamID}`,
            method: 'patch'
        }, {}, data)
            .then(res => {
                setOpen(false); setOpenD2(true);
                dispatchLoaderEvent(false);
            })
            .catch(err => {
                let error = err?.message;

                if (err.response) error = err.response?.data?.message?.error?.message;
                else if (err.request) error = err?.request;

                dispatchLoaderEvent(false);

                errorAlert(true, error.length > 0 ? error : 'An unknown error occured!');
            });
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
                ...dutyManagers.map(m => { return {id: m.id, role: 'owner'}})
            ],
            remove: [...removeUsers]
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
            channel_id: team.channelId,
            TeamID: team.teamId,
            tcos: [...tcoMembers.map(m => m.id)],
            duty_mgs: [...dutyManagers.map(m => m.id)]
        };

        await api({
            url: 'airport-teams/'+team.RowKey
        }, {}, data)
        .then(async () => {
            await fetchTeams();

            setOpenD2(false);

            setManagers([]);
            setTcoMembers([]);
            setTeamMembers([]);
            setRemoveUsers([]);
            setTeamName('');

            dispatchLoaderEvent(false);
        })
        .catch(async err => {
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
        console.log(teamMembers);
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
                onConfirm={() => updateTeam() }
                onCancel={() => setOpen(false)}
                header={<TopCard title={teamName} subTitle={subTitle} avatar={avatar} />}
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
                header={<TopCard title={teamName} subTitle={subTitle} avatar={avatar} />}
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