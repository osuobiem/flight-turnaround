import { Routes, Route } from 'react-router-dom';
import { links } from './Links';

import HQDashboard from '../pages/HQDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import Configure from '../pages/Configure';
import Test from '../pages/Test';

export default function Router() {
    return (

        <Routes>
            <Route exact path={links.hqDash} element={<HQDashboard />} />
            <Route path={links.configure} element={<Configure />} />
            <Route path={links.adminDash} element={<AdminDashboard />} />
            <Route path={links.test} element={<Test />} />
        </Routes>
    )
}