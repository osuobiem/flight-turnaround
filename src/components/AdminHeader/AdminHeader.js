import { Flex, FlexItem, Button, Input } from "@fluentui/react-northstar";
import { SearchIcon } from '@fluentui/react-icons-northstar'
import { useState, useEffect } from "react";

import CreateTeam from "../Dialogs/CreateTeam/CreateTeam";

import './AdminHeader.css';

const AdminHeader = ({users, fetchTeams, stations, teams, setTeams}) => {

    const [showCreateTeam, setShowCreateTeam] = useState(false);
    const [aTeams, setATeams] = useState([]);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        if((keyword.length === 0 && aTeams.length === 0)) {
            setATeams(teams);
        }
    }, [teams, aTeams, keyword]);

    const search = (searchKeyword) => {
        let theTeams = aTeams.length === 0 ? teams : aTeams;

        const results = theTeams.filter(t => {
            return t.TeamName.toLowerCase().includes(searchKeyword.toLowerCase());
        });
        
        setTeams(results);
        setKeyword(searchKeyword);
    }

    return (
        <div className="adm-header-container">
            <Flex space="between">
                <FlexItem>
                    <Button content="Create New Team" primary onClick={() => setShowCreateTeam(true) } />
                </FlexItem>

                <FlexItem>
                    <Input placeholder="Find" icon={<SearchIcon />} className="adm-find" onKeyUp={(e) => search(e.target.value)} inverted />
                </FlexItem>
            </Flex>

            <CreateTeam users={users} open={showCreateTeam} setOpen={setShowCreateTeam} fetchTeams={fetchTeams} stations={stations} />
        </div>
    )
};

export default AdminHeader;