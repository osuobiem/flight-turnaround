import { Flex, FlexItem, FormDropdown, Datepicker, Button } from "@fluentui/react-northstar";
import { useContext } from "react";
import { AppContext } from "../../AppContext";

import './HQTabFilters.css';

const HQTabFilters = ({filters, setFilters, downloadLink}) => {
    
    const { currentTheme } = useContext(AppContext);

    const themeSuffix = () => {
        switch (currentTheme) {
            case 'dark': return '-d';
            case 'contrast': return '-c';
            default: return '-l';
        }
    }

    const terminals = [
        {header: 'All', content: ''},
        {header: 'Abuja', content: 'ABV'},
        {header: 'Lagos', content: 'LOS'},
        {header: 'Jos', content: 'JOS'},
        {header: 'Port Harcourt', content: 'PHC'},
        {header: 'Uyo', content: 'QUO'},
        {header: 'Owerri', content: 'QOW'}
    ];

    const updateFilters = (key, value) => {
        let newFilters = {...filters};

        if(key === 'sta') {
            let date = new Date(value);
            newFilters[key] = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        }
        else {
            newFilters[key] = value.content;
        }

        setFilters(newFilters);
    }

    return (
        <div className="filters-container">
            <Flex gap="gap.large" space="between">
                <FlexItem>
                    <div className="fil-between">
                        <FormDropdown
                            label="Flight between"
                            className={`fil-select${themeSuffix()}`}
                            items={terminals}
                            defaultValue={terminals[0]}
                            onChange={(ev, op) => updateFilters('origin', op.value)}
                            inline />
                        
                        <FormDropdown
                            className={`fil-select${themeSuffix()}`}
                            items={terminals}
                            defaultValue={terminals[0]}
                            onChange={(ev, op) => updateFilters('destination', op.value)}
                            inline />

                        <Datepicker
                            today={new Date()}
                            defaultSelectedDate={new Date()}
                            onDateChange={(ev, op) => updateFilters('sta', op.value)}
                            className={`fil-date-picker${themeSuffix()}`}/>
                    </div>
                </FlexItem>

                <FlexItem>
                    <Button content="Export CSV" primary onClick={() => window.open(downloadLink)} style={{ marginRight: '12px' }}/>
                </FlexItem>
                
            </Flex>
        </div>
    )
};

export default HQTabFilters;