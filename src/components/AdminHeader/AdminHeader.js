import { Flex, FlexItem, Button, Input } from "@fluentui/react-northstar";
import { useState } from "react";

import TeamForm from "../Dialogs/TeamForm/TeamForm";

import './AdminHeader.css';

const AdminHeader = () => {

    const [showCreateTeam, setShowCreateTeam] = useState(false);

    return (
        <div className="adm-header-container">
            <Flex space="between">
                <FlexItem>
                    <Button content="Create New Team" primary onClick={() => setShowCreateTeam(true)} />
                </FlexItem>

                <FlexItem>
                    <Input placeholder="Find" inverted />
                </FlexItem>
            </Flex>

            <TeamForm open={showCreateTeam} setOpen={setShowCreateTeam} />
        </div>
    )
};

export default AdminHeader;