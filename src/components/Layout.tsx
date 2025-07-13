import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
    return (
        <>
            <Navbar />
            <div className="pt-16">
                <Outlet />
            </div>
        </>
    );
}

export default Layout;
