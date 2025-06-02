import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Cabins from './pages/Cabins'
import About from './pages/About'
import Contact from './pages/Contact'
import AppPage from './pages/AppPage'
import PrivateRoute from './components/PrivateRoute'
import {AuthProvider} from './context/AuthContext'

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/cabins" element={<Cabins/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/app" element={<AppPage/>}/>
                <Route
                    path="/admin"
                    element={
                        <PrivateRoute>
                            <Admin/>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </AuthProvider>
    )
}

export default App
