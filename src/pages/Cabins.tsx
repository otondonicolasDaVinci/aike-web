import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import 'styles/Cabins.css'

type Cabin = {
    id: number
    name: string
    description: string
    capacity: number
    available: boolean
}

function Cabins() {
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

    const handleReserve = (id: number) => {
        navigate(`/reservation/${id}`)
    }

    return (
        <section className="py-16 bg-teal-50 min-h-screen">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-12">Nuestras Cabañas</h1>

                {loading && <p className="text-center">Cargando...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cabins.map((cabin) => (
                        <div
                            key={cabin.id}
                            className="cabin-card bg-white rounded-lg overflow-hidden shadow-md transition duration-300 flex flex-col"
                        >
                            <div className="h-48 bg-teal-700 flex items-center justify-center">
                                <svg
                                    className="w-24 h-24 text-white opacity-80"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                </svg>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h2 className="text-xl font-semibold mb-2">{cabin.name}</h2>
                                <p className="text-gray-600 mb-4 flex-grow">{cabin.description}</p>
                                <p className="text-sm text-gray-500 mb-4">Capacidad: {cabin.capacity} personas</p>
                                <button
                                    className="mt-auto bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 w-full"
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
    )
}

export default Cabins
