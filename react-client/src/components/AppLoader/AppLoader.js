import { Loader } from '@fluentui/react-northstar';
import {useContext} from 'react';
import {LoaderContext} from '../../AppContext';

import './AppLoader.css';

const AppLoader = ({theme}) => {
    const {showLoader} = useContext(LoaderContext);

    return (
        <div className={`${theme === 'default' ? 'apl-container-l' : 'apl-container-d'} ${showLoader ? '' : 'd-none'}`}>
            <Loader size="large" label="Please Wait..." labelPosition="below" />
        </div>
    );
};

export default AppLoader;