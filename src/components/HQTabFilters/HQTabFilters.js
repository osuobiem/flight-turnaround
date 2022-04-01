import { Flex, FlexItem, FormDropdown, Datepicker } from "@fluentui/react-northstar";
import { useContext } from "react";
import { AppContext } from "../../AppContext";

import './HQTabFilters.css';

const HQTabFilters = () => {
    const { currentTheme } = useContext(AppContext);

    const themeSuffix = () => {
        switch (currentTheme) {
            case 'dark': return '-d';
            case 'contrast': return '-c';
            default: return '-l';
        }
    }

    const terminals = ['Abuja', 'Lagos', 'Jos', 'Port Harcourt', 'Uyo']

    return (
        <div className="filters-container">
            <Flex gap="gap.large">
                <FlexItem>
                    <div className="fil-between">
                        <FormDropdown
                            label="Flight between"
                            className={`fil-select${themeSuffix()}`}
                            items={terminals}
                            defaultValue={terminals[0]}
                            inline />
                        
                        <FormDropdown
                            className={`fil-select${themeSuffix()}`}
                            items={terminals}
                            defaultValue={terminals[1]}
                            inline />
                    </div>
                </FlexItem>

                <FlexItem>
                    <FormDropdown
                        label="Flight #"
                        className={`fil-select${themeSuffix()}`}
                        items={['All']}
                        defaultValue="All"
                        inline />
                </FlexItem>

                <FlexItem>
                    <Datepicker
                        today={new Date()}
                        defaultSelectedDate={new Date()}
                        allowManualInput={false}
                        className={`fil-date-picker${themeSuffix()}`}/>
                </FlexItem>
            </Flex>
        </div>
    )
};

export default HQTabFilters;