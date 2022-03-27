import { Routes, Route } from 'react-router-dom';
import { links } from './Links';

import HQTab from '../pages/HQTab';
import Configure from '../pages/Configure';

export default function Router() {
    return (

        <Routes>
            <Route exact path={links.tab} element={<HQTab />} />
            <Route path={links.configure} element={<Configure />} />
        </Routes>
    )
}