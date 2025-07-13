import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BackButton from './BackButton';

function Layout() {
    return (
        <>
            <Navbar />
            <BackButton />
            <div className="pt-16">
                <Outlet />
            </div>
        </>
    );
}

export default Layout;
