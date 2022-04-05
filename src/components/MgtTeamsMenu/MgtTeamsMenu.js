import { Menu } from '@fluentui/react-northstar';
import { MoreIcon } from '@fluentui/react-icons-northstar'
import TeamForm from '../Dialogs/TeamForm/TeamForm';
import ConfirmAction from '../Dialogs/ConfirmAction/ConfirmAction';
import { useState } from 'react';

import './MgtTeamsMenu.css';

const MgtTeamsMenu = ({
    title,
    subTitle = "Green Africa Ramp",
    avatar = "https://images.unsplash.com/photo-1531642765602-5cae8bbbf285" }) => {
    
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

    return (
        <div>
            <Menu items={menu} iconOnly activeIndex={1} />
            <TeamForm title={title} subTitle={subTitle} avatar={avatar} open={showEditTeam} setOpen={setShowEditTeam} />
            <ConfirmAction
                open={showDeleteTeam}
                setOpen={setShowDeleteTeam}
                content="Are you sure you want to delete this team?"
                confirmText="Yes, Delete"/>
        </div>
    );
};

export default MgtTeamsMenu;