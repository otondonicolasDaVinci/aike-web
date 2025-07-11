import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, provider } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'
import 'styles/Home.css'

function Home() {
    const { user } = useAuth()
    const token = localStorage.getItem('token')
    const [menuOpen, setMenuOpen] = useState(false)
    type Cabin = {
        id: number
        name: string
        description: string
        capacity: number
        available: boolean
    }
    const [cabins, setCabins] = useState<Cabin[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetch('https://aike-api.onrender.com/cabins')
            .then((response) => {
                if (!response.ok) throw new Error('Error al cargar las cabañas')
                return response.json()
            })
            .then((data) => {
                setCabins(data.filter((cabin: Cabin) => cabin.available))
                setLoading(false)
            })
            .catch((err) => {
                setError(err.message)
                setLoading(false)
            })
    }, [])

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider)
            const name = result.user.displayName || result.user.email
            let loginRes = await fetch('https://aike-api.onrender.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: name, password: 'from-google' })
            })

            if (!loginRes.ok) {
                await fetch('https://aike-api.onrender.com/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name,
                        email: result.user.email,
                        dni: '',
                        password: 'from-google',
                        role: { id: 2 }
                    })
                })
                loginRes = await fetch('https://aike-api.onrender.com/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user: name, password: 'from-google' })
                })
            }

            if (loginRes.ok) {
                const data = await loginRes.json()
                localStorage.setItem('token', data.token)
                let role = 'CLIENT'
                try {
                    const payload = JSON.parse(atob(data.token.split('.')[1]))
                    role = payload.r
                    localStorage.setItem('role', role)
                } catch {
                    localStorage.removeItem('role')
                }
                navigate(role === 'ADMIN' ? '/admin' : '/')
            } else {
                localStorage.setItem('role', 'CLIENT')
                navigate('/')
            }
        } catch {
            alert('Error al iniciar sesión')
        }
    }

    const handleLogout = async () => {
        if (user) await signOut(auth)
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        window.location.reload()
    }

    const handleReserve = (id: number) => {
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('role')
        if (!token) {
            navigate('/login')
            return
        }
        if (role !== 'CLIENT') {
            alert('Solo los clientes pueden realizar reservas')
            return
        }
        navigate(`/reservation/${id}`)
    }

    return (
        <>
            <nav className="bg-white shadow-md fixed w-full z-10">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <svg className="w-8 h-8 text-teal-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        <h1 className="text-2xl font-bold text-teal-700">Aike</h1>
                    </div>
                    <div className="hidden md:flex space-x-8">
                        <a href="#inicio" className="text-gray-700 hover:text-teal-700 font-medium">Inicio</a>
                        <a href="#nosotros" className="text-gray-700 hover:text-teal-700 font-medium">Nosotros</a>
                        <a href="#cabanas" className="text-gray-700 hover:text-teal-700 font-medium">Cabañas</a>
                        <a href="#ubicacion" className="text-gray-700 hover:text-teal-700 font-medium">Ubicación</a>
                        <a href="#contacto" className="text-gray-700 hover:text-teal-700 font-medium">Contacto</a>
                        {!user && !token && (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-teal-700 font-medium">Iniciar Sesión</Link>
                                <Link to="/register" className="text-gray-700 hover:text-teal-700 font-medium">Registrarse</Link>
                            </>
                        )}
                        {(user || token) && (
                            <button onClick={handleLogout} className="text-gray-700 hover:text-teal-700 font-medium">Cerrar sesión</button>
                        )}
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                {menuOpen && (
                    <div className="md:hidden bg-white pb-4 px-4">
                        <a href="#inicio" className="block py-2 text-gray-700 hover:text-teal-700 font-medium">Inicio</a>
                        <a href="#nosotros" className="block py-2 text-gray-700 hover:text-teal-700 font-medium">Nosotros</a>
                        <a href="#cabanas" className="block py-2 text-gray-700 hover:text-teal-700 font-medium">Cabañas</a>
                        <a href="#ubicacion" className="block py-2 text-gray-700 hover:text-teal-700 font-medium">Ubicación</a>
                        <a href="#contacto" className="block py-2 text-gray-700 hover:text-teal-700 font-medium">Contacto</a>
                        {!user && !token && (
                            <>
                                <Link to="/login" className="block py-2 text-gray-700 hover:text-teal-700 font-medium">Iniciar Sesión</Link>
                                <Link to="/register" className="block py-2 text-gray-700 hover:text-teal-700 font-medium">Registrarse</Link>
                            </>
                        )}
                        {(user || token) && (
                            <button onClick={handleLogout} className="block py-2 text-gray-700 hover:text-teal-700 font-medium text-left w-full">Cerrar sesión</button>
                        )}
                    </div>
                )}
            </nav>

            <section id="inicio" className="hero h-screen flex items-center justify-center pt-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Descubre la magia de la Patagonia</h1>
                    <p className="text-xl md:text-2xl text-white mb-10 max-w-3xl mx-auto">Cabañas Aike, tu refugio perfecto en el corazón del sur argentino</p>
                    <div className="date-picker p-6 rounded-lg max-w-3xl mx-auto">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Reserva tu estadía</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Fecha de llegada</label>
                                <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Fecha de salida</label>
                                <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Huéspedes</label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                                    <option>1 persona</option>
                                    <option>2 personas</option>
                                    <option>3 personas</option>
                                    <option>4 personas</option>
                                    <option>5+ personas</option>
                                </select>
                            </div>
                        </div>
                        <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-md transition duration-300 w-full md:w-auto">Buscar disponibilidad</button>
                    </div>
                </div>
            </section>

            <section id="nosotros" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Nuestra Historia</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="about-image h-96 rounded-lg shadow-lg"></div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-6 text-teal-700">El sueño de Aike</h3>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                Aike, que significa "lugar" en lengua tehuelche, nació en 2005 del sueño de la familia Mendoza,
                                oriunda de El Calafate. Después de tres generaciones viviendo en la Patagonia, Carlos y Elena Mendoza decidieron compartir la belleza de su tierra con viajeros de todo el mundo.
                            </p>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                Todo comenzó cuando heredaron un terreno familiar con vistas privilegiadas a las montañas y el lago. Con sus ahorros y mucho esfuerzo, construyeron la primera cabaña utilizando maderas nativas y técnicas tradicionales patagónicas, respetando el entorno natural que tanto amaban.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Lo que comenzó como un pequeño emprendimiento familiar se ha convertido hoy en un referente de hospitalidad en la región, manteniendo siempre la calidez y el servicio personalizado que caracteriza a la familia Mendoza. Cada cabaña ha sido diseñada y construida con amor, preservando la esencia de la Patagonia en cada detalle.
                            </p>
                        </div>
                    </div>

                    <div className="mt-16">
                        <h3 className="text-2xl font-semibold mb-8 text-center">Nuestra Trayectoria</h3>
                        <div className="relative border-l-2 border-teal-600 pl-8 ml-4 space-y-10 max-w-3xl mx-auto">
                            <div className="relative">
                                <div className="timeline-dot"></div>
                                <h4 className="text-xl font-semibold text-teal-700 mb-2">2005</h4>
                                <p className="text-gray-700">Construcción de la primera cabaña "Calafate" y apertura oficial de Cabañas Aike con la familia Mendoza recibiendo a sus primeros huéspedes.</p>
                            </div>
                            <div className="relative">
                                <div className="timeline-dot"></div>
                                <h4 className="text-xl font-semibold text-teal-700 mb-2">2008</h4>
                                <p className="text-gray-700">Expansión con la construcción de la cabaña "Perito Moreno" y el inicio de colaboraciones con guías locales para ofrecer excursiones personalizadas.</p>
                            </div>
                            <div className="relative">
                                <div className="timeline-dot"></div>
                                <h4 className="text-xl font-semibold text-teal-700 mb-2">2012</h4>
                                <p className="text-gray-700">Inauguración de la cabaña premium "Fitz Roy" con jacuzzi y terraza panorámica, y reconocimiento como "Alojamiento Destacado" por la Secretaría de Turismo.</p>
                            </div>
                            <div className="relative">
                                <div className="timeline-dot"></div>
                                <h4 className="text-xl font-semibold text-teal-700 mb-2">2018</h4>
                                <p className="text-gray-700">Implementación de prácticas sustentables: paneles solares, sistema de recolección de agua de lluvia y huerta orgánica para nuestros huéspedes.</p>
                            </div>
                            <div className="relative">
                                <div className="timeline-dot"></div>
                                <h4 className="text-xl font-semibold text-teal-700 mb-2">Hoy</h4>
                                <p className="text-gray-700">Seguimos creciendo como empresa familiar, manteniendo nuestros valores de hospitalidad, autenticidad y respeto por la naturaleza patagónica que nos rodea.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <h3 className="text-2xl font-semibold mb-6">Nuestros Valores</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <div className="bg-teal-50 p-6 rounded-lg">
                                <div className="bg-teal-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-teal-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-semibold mb-2">Hospitalidad</h4>
                                <p className="text-gray-600">Recibimos a cada huésped como parte de nuestra familia, brindando calidez y atención personalizada.</p>
                            </div>
                            <div className="bg-teal-50 p-6 rounded-lg">
                                <div className="bg-teal-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-teal-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-semibold mb-2">Autenticidad</h4>
                                <p className="text-gray-600">Preservamos y compartimos la verdadera esencia de la cultura y tradiciones patagónicas.</p>
                            </div>
                            <div className="bg-teal-50 p-6 rounded-lg">
                                <div className="bg-teal-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-teal-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-semibold mb-2">Sustentabilidad</h4>
                                <p className="text-gray-600">Nos comprometemos a proteger y preservar el entorno natural que nos rodea para las futuras generaciones.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="cabanas" className="py-16 bg-teal-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Nuestras Cabañas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading && <p className="status col-span-full">Cargando...</p>}
                        {error && <p className="status col-span-full text-red-600">{error}</p>}
                        {cabins.map((cabin) => (
                            <div className="cabin-card bg-white rounded-lg overflow-hidden shadow-md transition duration-300" key={cabin.id}>
                                <div className="h-48 bg-teal-700 flex items-center justify-center">
                                    <svg className="w-24 h-24 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                </div>
                                <div className="p-6 flex flex-col">
                                    <h3 className="text-xl font-semibold mb-2">{cabin.name}</h3>
                                    <p className="text-gray-600 mb-4 flex-grow">{cabin.description}</p>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-teal-700 font-bold text-xl">Capacidad: {cabin.capacity}</span>
                                    </div>
                                    <button
                                        className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
                                        onClick={() => handleReserve(cabin.id)}
                                    >
                                        Reservar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="ubicacion" className="py-16 bg-teal-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Nuestra ubicación</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <div className="bg-teal-700 h-64 md:h-96 rounded-lg flex items-center justify-center">
                                <svg className="w-24 h-24 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-4">En el corazón de la Patagonia</h3>
                            <p className="text-gray-600 mb-6">Nuestras cabañas se encuentran estratégicamente ubicadas en el sur de la Patagonia Argentina, a solo:</p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-teal-600 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>15 minutos del Parque Nacional Los Glaciares</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-teal-600 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>30 minutos del Glaciar Perito Moreno</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-teal-600 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>5 minutos del centro de El Calafate</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-teal-600 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>2 horas de El Chaltén y el Monte Fitz Roy</span>
                                </li>
                            </ul>
                            <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-md transition duration-300">Ver en el mapa</button>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-6 text-center bg-white" id="contacto">
                {!user && !token ? (
                    <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-md transition duration-300" onClick={handleLogin}>Iniciar sesión</button>
                ) : (
                    <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-md transition duration-300" onClick={handleLogout}>Cerrar sesión</button>
                )}
                <p className="text-gray-600 mt-4">© 2025 Aike · Proyecto de tesis · Da Vinci</p>
            </footer>
        </>
    )
}

export default Home
