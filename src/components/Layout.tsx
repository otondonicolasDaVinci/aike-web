import { Outlet } from 'react-router-dom';
import BackButton from './BackButton';

function Layout() {
    return (
        <>
            <BackButton />
            <div className="pt-16">
                <Outlet />
            </div>
        </>
    );
}

export default Layout;
