import { Flex, FlexItem, FormDropdown, Datepicker, Button } from "@fluentui/react-northstar";
import { useContext, useState, useEffect, useCallback } from "react";
import { AppContext } from "../../AppContext";

import './HQTabFilters.css';

const HQTabFilters = ({filters, setFilters, downloadLink, flightStations}) => {
    
    const { currentTheme } = useContext(AppContext);

    const setTerminals = useCallback(
        (exempt = '') => {

            let t = [
                {header: 'All Stations', content: ''}
            ]
    
            for (const key in flightStations) {
                if(exempt === '' || exempt !== key) {
                    t.push({header: flightStations[key], content: key});
                }
            }
    
            return t;
        },
      [flightStations],
    )
    

    const [dTerminals, setDTerminals] = useState([{header: 'All Stations', content: ''}]);
    const [oTerminals, setOTerminals] = useState([{header: 'All Stations', content: ''}]);

    useEffect(() => {

        setDTerminals(setTerminals());
        setOTerminals(setTerminals());
        
    }, [flightStations, setDTerminals, setOTerminals, setTerminals])
    

    const themeSuffix = () => {
        switch (currentTheme) {
            case 'dark': return '-d';
            case 'contrast': return '-c';
            default: return '-l';
        }
    }

    const updateFilters = (key, value) => {
        let newFilters = {...filters};

        if(key === 'sta') {
            let date = new Date(value);
            newFilters[key] = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        }
        else {
            newFilters[key] = value.content;

            if(key === 'origin') {
                setDTerminals(setTerminals(value.content));
            }
            else {
                setOTerminals(setTerminals(value.content));
            }
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
                            items={oTerminals}
                            defaultValue={oTerminals[0]}
                            onChange={(ev, op) => updateFilters('origin', op.value)}
                            inline />
                        
                        <FormDropdown
                            className={`fil-select${themeSuffix()}`}
                            items={dTerminals}
                            defaultValue={dTerminals[0]}
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