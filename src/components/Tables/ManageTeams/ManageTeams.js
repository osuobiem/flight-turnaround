import { LocationIcon, Table, Text, ContactCardIcon } from "@fluentui/react-northstar";
import TableSort from "../../../helpers/TableSort";

import MgtTeamsMenu from "../../MgtTeamsMenu/MgtTeamsMenu";

import "./ManageTeams.css";

import { useState, useEffect, useMemo } from "react";

const ManageTeams = ({teams, fetchTeams}) => {

    const headerClass = 'mgt-header';
    const [header, setHeader] = useState({
        items: [
            {
                key: "channel-name",
                title: <div><ContactCardIcon outline /><Text className="mgt-header-txt" content="Channel Name"/></div>,
                content: <div><ContactCardIcon outline /><Text className="mgt-header-txt" content="Channel Name"/></div>,
                className: headerClass,
                icon: 'arrowUp',
                'aria-sort': undefined,
                onClick: () => tableSort.doSort(0),
                onMouseOver: () => tableSort.toggleIcon(0),
                onMouseLeave: () => tableSort.toggleIcon(0, false)
            },
            {
                key: "airport-location",
                title: <div><LocationIcon outline /><Text className="mgt-header-txt" content="Airport Location"/></div>,
                content: <div><LocationIcon outline /><Text className="mgt-header-txt" content="Airport Location"/></div>,
                className: headerClass,
                icon: 'arrowUp',
                'aria-sort': undefined,
                onClick: () => tableSort.doSort(1),
                onMouseOver: () => tableSort.toggleIcon(1),
                onMouseLeave: () => tableSort.toggleIcon(1, false)
            },
            {
                key: "zone",
                title: <div><LocationIcon outline /><Text className="mgt-header-txt" content="Zone"/></div>,
                content: <div><LocationIcon outline /><Text className="mgt-header-txt" content="Zone"/></div>,
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

    const tableSort = useMemo(() => new TableSort(header, setHeader), [header]);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        let tRows = teams.map((team, i) => {
            return {
                key: i,
                items: [
                  { key: `${i}-1`, content: team.TeamName },
                  { key: `${i}-2`, content: team.Location },
                  { key: `${i}-3`, content: team.Zone },
                  { key: `${i}-4`, content: <MgtTeamsMenu team={team} fetchTeams={fetchTeams} />, style: {justifyContent: 'right'} }
                ]
            }
        });

        setRows(tRows);
    }, [teams, fetchTeams]);

    useEffect(() => {
        tableSort.setRows(rows);
    }, [rows, tableSort]);

    return (
        <div className="tab-container">
            <Table compact header={header} rows={rows} className="mgt-table" />
        </div>
    );
};

export default ManageTeams;
