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
        <div className="cabins-wrapper">
            <div className="cabins-header">
                <h1>Conocé nuestras cabañas</h1>
                <p>Elige entre una variedad de opciones pensadas para vos.</p>
            </div>

            {loading && <p className="status">Cargando...</p>}
            {error && <p className="status error">{error}</p>}

            <div className="cabins-grid">
                {cabins.map((cabin) => (
                    <div className="cabin-box" key={cabin.id}>
                        <div className="cabin-text">
                            <h2>{cabin.name}</h2>
                            <p>{cabin.description}</p>
                            <p className="capacity">Capacidad: {cabin.capacity} personas</p>
                        </div>
                        <button className="reserve-btn" onClick={() => handleReserve(cabin.id)}>
                            Reservar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Cabins
