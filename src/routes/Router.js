import { Routes, Route } from 'react-router-dom';
import { links } from './Links';

import Tab from '../pages/Tab';
import Configure from '../pages/Configure';

export default function Router() {
    return (

        <Routes>
            <Route exact path={links.tab} element={<Tab />} />
            <Route path={links.configure} element={<Configure />} />
        </Routes>
    )
}