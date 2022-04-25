import { Flex, FlexItem, Button, Input } from "@fluentui/react-northstar";
import { SearchIcon } from '@fluentui/react-icons-northstar'
import { useState } from "react";

import CreateTeam from "../Dialogs/CreateTeam/CreateTeam";

import './AdminHeader.css';

const AdminHeader = ({users, fetchTeams, stations}) => {

    const [showCreateTeam, setShowCreateTeam] = useState(false);

    return (
        <div className="adm-header-container">
            <Flex space="between">
                <FlexItem>
                    <Button content="Create New Team" primary onClick={() => setShowCreateTeam(true) } />
                </FlexItem>

                <FlexItem>
                    <Input placeholder="Find" icon={<SearchIcon />} className="adm-find" inverted />
                </FlexItem>
            </Flex>

            <CreateTeam users={users} open={showCreateTeam} setOpen={setShowCreateTeam} fetchTeams={fetchTeams} stations={stations} />
        </div>
    )
};

export default AdminHeader;