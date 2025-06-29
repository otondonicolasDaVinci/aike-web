import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import Cabins from './pages/Cabins';
import About from './pages/About';
import Contact from './pages/Contact';
import AppPage from './pages/AppPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Reservation from './pages/Reservation';

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
                <Route path="/cabins" element={<Cabins />} />
                <Route path="/about" element={<About />} />
                <Route path="/contacto" element={<Contact />} />
                <Route path="/app" element={<AppPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reservation/:id" element={<Reservation />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
