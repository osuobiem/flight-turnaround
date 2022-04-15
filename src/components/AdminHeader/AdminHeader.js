import { Flex, FlexItem, Button, Input } from "@fluentui/react-northstar";
import { SearchIcon } from '@fluentui/react-icons-northstar'
import { useState } from "react";
import * as msTeams from '@microsoft/teams-js';

import CreateTeam from "../Dialogs/CreateTeam/CreateTeam";

import './AdminHeader.css';

msTeams.initialize();

const AdminHeader = ({people, graphClient}) => {

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

            <CreateTeam open={showCreateTeam} setOpen={setShowCreateTeam} people={people} graphClient={graphClient} />
        </div>
    )
};

export default AdminHeader;