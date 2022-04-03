import { Menu } from '@fluentui/react-northstar';
import { MoreIcon } from '@fluentui/react-icons-northstar'
import CreateTeam from '../Dialogs/CreateTeam/CreateTeam';
import { useState } from 'react';

import './MgtTeamsMenu.css';

const MgtTeamsMenu = () => {
    const [showCreateTeam, setShowCreateTeam] = useState(false);

    const menu = [
        {
            icon: <MoreIcon {...{ outline: true, }}/>,
            "aria-label": "More options",
            indicator: false,
            key: 1,
            menu: {
                items: [
                    { key: 1, content: "Edit Team", onClick: () => setShowCreateTeam(true) },
                    { key: 2, content: "Delete Team", className: 'mtm-delete' }
                ],
            },
        },
    ];

    return (
        <div>
            <Menu items={menu} iconOnly activeIndex={1} />
            <CreateTeam open={showCreateTeam} setOpen={setShowCreateTeam} />
        </div>
    );
};

export default MgtTeamsMenu;