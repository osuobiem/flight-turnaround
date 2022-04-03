import { Table } from "@fluentui/react-northstar";
import TableSort from "../../../helpers/TableSort";

import MgtTeamsMenu from "../../MgtTeamsMenu/MgtTeamsMenu";

import "./ManageTeams.css";

import { useState } from "react";

const ManageTeams = () => {

    const headerClass = 'mgt-header';
    const [header, setHeader] = useState({
        items: [
            {
                key: "channel-name",
                title: "Channel Name",
                content: "Channel Name",
                className: headerClass,
                icon: 'arrowUp',
                'aria-sort': undefined,
                onClick: () => tableSort.doSort(0),
                onMouseOver: () => tableSort.toggleIcon(0),
                onMouseLeave: () => tableSort.toggleIcon(0, false)
            },
            {
                key: "airport-location",
                title: "Airport Location",
                content: "Airport Location",
                className: headerClass,
                icon: 'arrowUp',
                'aria-sort': undefined,
                onClick: () => tableSort.doSort(1),
                onMouseOver: () => tableSort.toggleIcon(1),
                onMouseLeave: () => tableSort.toggleIcon(1, false)
            },
            {
                key: "zone",
                title: "Zone",
                content: "Zone",
                className: headerClass,
                icon: 'arrowUp',
                'aria-sort': undefined,
                onClick: () => tableSort.doSort(2),
                onMouseOver: () => tableSort.toggleIcon(2),
                onMouseLeave: () => tableSort.toggleIcon(2, false)
            },
            { key: "more options", "aria-label": "options" },
        ],
    });

    const [rows] = useState([
        {
            key: 1,
            items: [
                { key: "1-1", content: "Flight Ops Lagos" },
                { key: "1-2", content: "Lagos" },
                { key: "1-3", content: "West" },
                { key: "1-4", content: <MgtTeamsMenu /> },
            ],
        },
        {
            key: 2,
            items: [
                { key: "1-1", content: "Abuja - Flight Ops" },
                { key: "1-2", content: "Abuja" },
                { key: "1-3", content: "North" },
                { key: "1-4", content: <MgtTeamsMenu /> },
            ],
        },
    ]);

    const tableSort = new TableSort(header, rows, setHeader);

    return (
        <div className="tab-container">
            <Table compact header={header} rows={rows} className="mgt-table" />
        </div>
    );
};

export default ManageTeams;
