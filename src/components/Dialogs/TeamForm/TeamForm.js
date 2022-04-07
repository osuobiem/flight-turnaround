import { Dialog, CloseIcon, Input, FormDropdown } from "@fluentui/react-northstar";
import { useState } from "react";
import TopCard from "../../../helpers/TopCard";

import "./TeamForm.css";

const TeamForm = ({
    title = "Create New Airport Flight Ops Team",
    subTitle = "GA Turnaround",
    avatar = "https://images.unsplash.com/photo-1531642765602-5cae8bbbf285", open, setOpen }) => {

    const [openD2, setOpenD2] = useState(false);

    const terminals = ['Abuja', 'Lagos', 'Jos', 'Port Harcourt', 'Uyo'];
    const zones = ['West', 'North', 'South', 'East'];

    return (
        <div>
            <Dialog
                open={open}
                cancelButton="Close"
                confirmButton="Next"
                onConfirm={() => { setOpen(false); setOpenD2(true) }}
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
                                <Input
                                    label={{ content: "Flight Ops Team Name", htmlFor: "flight-ops-team-name" }}
                                    placeholder="Flight Ops Team Name"
                                    name="flightOpsTeamName"
                                    id="flight-ops-team-name"
                                    required fluid
                                    showSuccessIndicator={false}
                                />

                                <FormDropdown
                                    label="Airport Location"
                                    items={terminals}
                                    defaultValue={terminals[1]}
                                    fluid
                                />

                                <FormDropdown
                                    label="Zone"
                                    items={zones}
                                    defaultValue={zones[1]}
                                    fluid
                                />

                                <Component {...rest} />
                            </div>
                        );
                    },
                }}
            />

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


                                <Component {...rest} />
                            </div>
                        );
                    },
                }}
            />
        </div>
    );
};

export default TeamForm;