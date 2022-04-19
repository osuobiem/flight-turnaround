import { Menu } from '@fluentui/react-northstar';
import { MoreIcon } from '@fluentui/react-icons-northstar'
import FlightDetails from '../Dialogs/FlightDetails/FlightDetails';
import { useState } from 'react';

const HQTableMenu = ({flight}) => {
    const [showFlightDetails, setShowFlightDetails] = useState(false);

    const menu = [
        {
            icon: <MoreIcon {...{ outline: true, }}/>,
            "aria-label": "More options",
            indicator: false,
            key: 1,
            menu: {
                items: [
                    { key: 1, content: "View Details", onClick: () => setShowFlightDetails(true) },
                    { key: 2, content: "Notify Members" }
                ],
            },
        },
    ];

    return (
        <div>
            <Menu items={menu} iconOnly activeIndex={1} />
            <FlightDetails flight={flight} open={showFlightDetails} setOpen={setShowFlightDetails} />
        </div>
    );
};

export default HQTableMenu;