import { Flex, FlexItem, Button, Input } from "@fluentui/react-northstar";
import { SearchIcon } from '@fluentui/react-icons-northstar'
import { useState } from "react";
import * as msTeams from '@microsoft/teams-js';

import CreateTeam from "../Dialogs/CreateTeam/CreateTeam";

import './AdminHeader.css';
import { useEffect } from "react";

msTeams.initialize();

const AdminHeader = () => {

    useEffect(() => {
        if (localStorage.getItem('testX')) {
            localStorage.removeItem('testX');
            
            let vars = [],
                hash;
            let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (let i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }

            alert(vars['code']);
        }
    })

    const [showCreateTeam, setShowCreateTeam] = useState(false);

    const authenticateUser = () => {
        localStorage.setItem('testX', 'true');
        window.location.assign('https://login.microsoftonline.com/c4f3936d-9462-491d-98a3-a42c1dd09b3b/oauth2/v2.0/authorize?client_id=9d7b0900-3c58-4fda-8156-34b3635d25d0&response_type=code&response_mode=query&scope=User.Read&state=12345');
        // msTeams.authentication.authenticate({
        //     url: "https://login.microsoftonline.com/c4f3936d-9462-491d-98a3-a42c1dd09b3b/oauth2/v2.0/authorize?client_id=9d7b0900-3c58-4fda-8156-34b3635d25d0&response_type=code&response_mode=query&scope=User.Read&state=12345",
        //     width: 600,
        //     height: 535,
        //     successCallback: function (result) {
        //         console.log(result)
        //     },
        //     failureCallback: function (reason) {
        //         console.log(reason);
        //     }
        // });
    }

    return (
        <div className="adm-header-container">
            <Flex space="between">
                <FlexItem>
                    <Button content="Create New Team" primary onClick={() => authenticateUser() } />
                </FlexItem>

                <FlexItem>
                    <Input placeholder="Find" icon={<SearchIcon />} className="adm-find" inverted />
                </FlexItem>
            </Flex>

            <CreateTeam open={showCreateTeam} setOpen={setShowCreateTeam} />
        </div>
    )
};

export default AdminHeader;