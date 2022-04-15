import { Dialog, CloseIcon, Input, FormDropdown } from "@fluentui/react-northstar";
import { useEffect, useState } from "react";
import TopCard from "../../../helpers/TopCard";
import { graphApi } from "../../../helpers/GraphHandler";
import ErrorAlert from "../../AlertsMessage/ErrorAlert";

import "./CreateTeam.css";
import { useContext } from "react";
import { AuthContext } from "../../../AppContext";
import msalInstance from "../../../config/msalInstance";

const CreateTeam = ({ open, setOpen }) => {

    const { token } = useContext(AuthContext);

    const [openD2, setOpenD2] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [apLocation, setApLocation] = useState('Abuja');
    const [zone, setZone] = useState('North');
    const [team, setTeam] = useState({});

    const [tcoMembers, setTcoMembers] = useState([]);
    const [tcoManagers, setManagers] = useState([]);

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const title = "Create New Airport Flight Ops Team"
    const subTitle = "GA Turnaround";
    const avatar = "https://images.unsplash.com/photo-1531642765602-5cae8bbbf285";

    const terminals = ['Abuja', 'Lagos', 'Jos', 'Port Harcourt', 'Uyo'];
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
        setOpen(false); setOpenD2(true);
        
        msalInstance.loginPopup({
            redirectUri: "http://localhost:3000/admin"
        });

        // let data = {
        //     'description': `${teamName} | ${apLocation} | ${zone}`,
        //     'displayName': teamName,
        //     'isFavoriteByDefault': true
        // };

        // graphApi('createChannel', token, data)
        //     .then(res => {
        //         setTeam(res.data);
        //         setOpen(false); setOpenD2(true);

        //         console.log(team);
        //     })
        //     .catch(err => {
        //         let error = err.message;

        //         if (err.response) error = err.response.data.error.message;
        //         else if (err.request) error = err.request;

        //         console.log(error);
        //         errorAlert(true, error);
        //     });
    }

    // Fetch People using GrapAPI
    const getPeople = async () => {
        graphApi('getPeople', token)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                let error = err.message;

                if (err.response) error = err.response.data.error.message;
                else if (err.request) error = err.request;

                console.log(error);
                errorAlert(true, error);
            });
    }

    const pickMembers = (value, type) => {
        if (type === 'member') setTcoMembers(value);
        else setManagers(value);
    }

    const people = [
        'Jeff', 'Moses', 'Patrick', 'Wisdom', 'Shrek', 'Eddie', 'Justin', 'Peter'
    ];

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
                onConfirm={() => setOpenD2(false)}
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

                                <FormDropdown
                                    search multiple
                                    label="Choose TCO members"
                                    items={people} fluid
                                    placeholder="Start typing a name"
                                    noResultsMessage="We did't find any matches."
                                    a11ySelectedItemsMessage="Press Delete or Backspace to remove"
                                    onChange={(ev, op) => pickMembers(op.value, 'member')}
                                    className="tf-people"/>
                                
                                <FormDropdown
                                    search multiple
                                    label="Choose Duty managers"
                                    items={people} fluid
                                    placeholder="Start typing a name"
                                    noResultsMessage="We did't find any matches."
                                    a11ySelectedItemsMessage="Press Delete or Backspace to remove"
                                    onChange={(ev, op) => pickMembers(op.value, 'manager')}
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