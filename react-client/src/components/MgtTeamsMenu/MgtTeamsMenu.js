import { Menu } from '@fluentui/react-northstar';
import { MoreIcon } from '@fluentui/react-icons-northstar'
import EditTeam from '../Dialogs/EditTeam/EditTeam';
import ConfirmAction from '../Dialogs/ConfirmAction/ConfirmAction';
import { useState } from 'react';

import './MgtTeamsMenu.css';
import {api} from '../../helpers/ApiHandler';

const MgtTeamsMenu = ({ team, fetchTeams, stations, users }) => {
    
    const [showEditTeam, setShowEditTeam] = useState(false);
    const [showDeleteTeam, setShowDeleteTeam] = useState(false);

    const menu = [
        {
            icon: <MoreIcon {...{ outline: true, }}/>,
            "aria-label": "More options",
            indicator: false,
            key: 1,
            menu: {
                items: [
                    { key: 1, content: "Edit Team", onClick: () => setShowEditTeam(true) },
                    { key: 2, content: "Delete Team", className: 'mtm-delete', onClick: () => setShowDeleteTeam(true) }
                ],
            },
        },
    ];

    const deleteTeam = async () => {
        await api({
            url: `graph/groups/${team.TeamID}`,
            method: 'delete'
        }).then(async () => {
            await api({
                url: `airport-teams/${team.RowKey}`,
                method: 'delete'
            });
            await fetchTeams();
        })
    }

    return (
        <div>
            <Menu items={menu} iconOnly activeIndex={1} />
            <EditTeam open={showEditTeam} setOpen={setShowEditTeam} fetchTeams={fetchTeams} team={team} stations={stations} users={users} />
            <ConfirmAction
                open={showDeleteTeam}
                setOpen={setShowDeleteTeam}
                content="Are you sure you want to delete this team?"
                confirmText="Yes, Delete" action={deleteTeam}/>
        </div>
    );
};

export default MgtTeamsMenu;