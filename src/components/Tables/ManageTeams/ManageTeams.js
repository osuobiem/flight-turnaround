import { LocationIcon, Table, Text, ContactCardIcon } from "@fluentui/react-northstar";
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

    const [rows] = useState([
        {
            key: 1,
            items: [
                { key: "1-1", content: "Flight Ops Lagos" },
                { key: "1-2", content: "Lagos" },
                { key: "1-3", content: "West" },
                { key: "1-4", content: <MgtTeamsMenu title="Edit Flight Ops Lagos" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 2,
            items: [
                { key: "2-1", content: "Abuja - Flight Ops" },
                { key: "2-2", content: "Abuja" },
                { key: "2-3", content: "North" },
                { key: "2-4", content: <MgtTeamsMenu title="Edit Abuja - Flight Ops" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 3,
            items: [
                { key: "3-1", content: "Ilorin - Flight Ops" },
                { key: "3-2", content: "Ilorin" },
                { key: "3-3", content: "West" },
                { key: "3-4", content: <MgtTeamsMenu title="Edit Ilorin - Flight Ops" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 4,
            items: [
                { key: "4-1", content: "Benin - Flight Ops" },
                { key: "4-2", content: "Benin" },
                { key: "4-3", content: "South" },
                { key: "4-4", content: <MgtTeamsMenu title="Edit Benin - Flight Ops" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 5,
            items: [
                { key: "5-1", content: "Akure - Flight Ops" },
                { key: "5-2", content: "Akure" },
                { key: "5-3", content: "West" },
                { key: "5-4", content: <MgtTeamsMenu title="Edit Akure - Flight Ops" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 1,
            items: [
                { key: "1-1", content: "Flight Ops Lagos" },
                { key: "1-2", content: "Lagos" },
                { key: "1-3", content: "West" },
                { key: "1-4", content: <MgtTeamsMenu title="Edit Flight Ops Lagos" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 2,
            items: [
                { key: "2-1", content: "Abuja - Flight Ops" },
                { key: "2-2", content: "Abuja" },
                { key: "2-3", content: "North" },
                { key: "2-4", content: <MgtTeamsMenu title="Edit Abuja - Flight Ops" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 3,
            items: [
                { key: "3-1", content: "Ilorin - Flight Ops" },
                { key: "3-2", content: "Ilorin" },
                { key: "3-3", content: "West" },
                { key: "3-4", content: <MgtTeamsMenu title="Edit Ilorin - Flight Ops" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 4,
            items: [
                { key: "4-1", content: "Benin - Flight Ops" },
                { key: "4-2", content: "Benin" },
                { key: "4-3", content: "South" },
                { key: "4-4", content: <MgtTeamsMenu title="Edit Benin - Flight Ops" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 5,
            items: [
                { key: "5-1", content: "Akure - Flight Ops" },
                { key: "5-2", content: "Akure" },
                { key: "5-3", content: "West" },
                { key: "5-4", content: <MgtTeamsMenu title="Edit Akure - Flight Ops" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 1,
            items: [
                { key: "1-1", content: "Flight Ops Lagos" },
                { key: "1-2", content: "Lagos" },
                { key: "1-3", content: "West" },
                { key: "1-4", content: <MgtTeamsMenu title="Edit Flight Ops Lagos" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 2,
            items: [
                { key: "2-1", content: "Abuja - Flight Ops" },
                { key: "2-2", content: "Abuja" },
                { key: "2-3", content: "North" },
                { key: "2-4", content: <MgtTeamsMenu title="Edit Abuja - Flight Ops" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 3,
            items: [
                { key: "3-1", content: "Ilorin - Flight Ops" },
                { key: "3-2", content: "Ilorin" },
                { key: "3-3", content: "West" },
                { key: "3-4", content: <MgtTeamsMenu title="Edit Ilorin - Flight Ops" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 4,
            items: [
                { key: "4-1", content: "Benin - Flight Ops" },
                { key: "4-2", content: "Benin" },
                { key: "4-3", content: "South" },
                { key: "4-4", content: <MgtTeamsMenu title="Edit Benin - Flight Ops" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 5,
            items: [
                { key: "5-1", content: "Akure - Flight Ops" },
                { key: "5-2", content: "Akure" },
                { key: "5-3", content: "West" },
                { key: "5-4", content: <MgtTeamsMenu title="Edit Akure - Flight Ops" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 1,
            items: [
                { key: "1-1", content: "Flight Ops Lagos" },
                { key: "1-2", content: "Lagos" },
                { key: "1-3", content: "West" },
                { key: "1-4", content: <MgtTeamsMenu title="Edit Flight Ops Lagos" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 2,
            items: [
                { key: "2-1", content: "Abuja - Flight Ops" },
                { key: "2-2", content: "Abuja" },
                { key: "2-3", content: "North" },
                { key: "2-4", content: <MgtTeamsMenu title="Edit Abuja - Flight Ops" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 3,
            items: [
                { key: "3-1", content: "Ilorin - Flight Ops" },
                { key: "3-2", content: "Ilorin" },
                { key: "3-3", content: "West" },
                { key: "3-4", content: <MgtTeamsMenu title="Edit Ilorin - Flight Ops" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 4,
            items: [
                { key: "4-1", content: "Benin - Flight Ops" },
                { key: "4-2", content: "Benin" },
                { key: "4-3", content: "South" },
                { key: "4-4", content: <MgtTeamsMenu title="Edit Benin - Flight Ops" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 5,
            items: [
                { key: "5-1", content: "Akure - Flight Ops" },
                { key: "5-2", content: "Akure" },
                { key: "5-3", content: "West" },
                { key: "5-4", content: <MgtTeamsMenu title="Edit Akure - Flight Ops" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 1,
            items: [
                { key: "1-1", content: "Flight Ops Lagos" },
                { key: "1-2", content: "Lagos" },
                { key: "1-3", content: "West" },
                { key: "1-4", content: <MgtTeamsMenu title="Edit Flight Ops Lagos" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 2,
            items: [
                { key: "2-1", content: "Abuja - Flight Ops" },
                { key: "2-2", content: "Abuja" },
                { key: "2-3", content: "North" },
                { key: "2-4", content: <MgtTeamsMenu title="Edit Abuja - Flight Ops" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 3,
            items: [
                { key: "3-1", content: "Ilorin - Flight Ops" },
                { key: "3-2", content: "Ilorin" },
                { key: "3-3", content: "West" },
                { key: "3-4", content: <MgtTeamsMenu title="Edit Ilorin - Flight Ops" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 4,
            items: [
                { key: "4-1", content: "Benin - Flight Ops" },
                { key: "4-2", content: "Benin" },
                { key: "4-3", content: "South" },
                { key: "4-4", content: <MgtTeamsMenu title="Edit Benin - Flight Ops" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 5,
            items: [
                { key: "5-1", content: "Akure - Flight Ops" },
                { key: "5-2", content: "Akure" },
                { key: "5-3", content: "West" },
                { key: "5-4", content: <MgtTeamsMenu title="Edit Akure - Flight Ops" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 1,
            items: [
                { key: "1-1", content: "Flight Ops Lagos" },
                { key: "1-2", content: "Lagos" },
                { key: "1-3", content: "West" },
                { key: "1-4", content: <MgtTeamsMenu title="Edit Flight Ops Lagos" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 2,
            items: [
                { key: "2-1", content: "Abuja - Flight Ops" },
                { key: "2-2", content: "Abuja" },
                { key: "2-3", content: "North" },
                { key: "2-4", content: <MgtTeamsMenu title="Edit Abuja - Flight Ops" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 3,
            items: [
                { key: "3-1", content: "Ilorin - Flight Ops" },
                { key: "3-2", content: "Ilorin" },
                { key: "3-3", content: "West" },
                { key: "3-4", content: <MgtTeamsMenu title="Edit Ilorin - Flight Ops" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 4,
            items: [
                { key: "4-1", content: "Benin - Flight Ops" },
                { key: "4-2", content: "Benin" },
                { key: "4-3", content: "South" },
                { key: "4-4", content: <MgtTeamsMenu title="Edit Benin - Flight Ops" />, style: {justifyContent: 'right'} },
            ],
        },
        {
            key: 5,
            items: [
                { key: "5-1", content: "Akure - Flight Ops" },
                { key: "5-2", content: "Akure" },
                { key: "5-3", content: "West" },
                { key: "5-4", content: <MgtTeamsMenu title="Edit Akure - Flight Ops" />, style: {justifyContent: 'right'} },
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
