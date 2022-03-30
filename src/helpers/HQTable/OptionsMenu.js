import { Menu } from '@fluentui/react-northstar';
import { MoreIcon } from '@fluentui/react-icons-northstar'

const OptionsMenu = () => {
    const menu = [
        {
            icon: <MoreIcon {...{ outline: true, }}/>,
            "aria-label": "More options",
            indicator: false,
            menu: {
                items: [
                    { key: 1, content: "View Details" },
                    { key: 2, content: "Notify Members" }
                ],
            },
        },
    ];

    return <Menu items={menu} iconOnly activeIndex={1} />;
};

export default OptionsMenu;