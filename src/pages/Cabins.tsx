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
        fetch('/cabins')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar las cabañas')
                }
                return response.json()
            })
            .then(data => {
                setCabins(data.filter((cabin: Cabin) => cabin.available))
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [])

    const handleReserve = (id: number) => {
        navigate(`/reservation/${id}`)
    }

    return (
        <div className="page-container">
            <h1 className="page-title">Nuestras Cabañas</h1>
            <p className="page-subtitle">
                Estas son las cabañas actualmente disponibles en nuestro complejo. Reservá de forma rápida, segura y 100% online.
            </p>

            {loading && <p className="status">Cargando...</p>}
            {error && <p className="status error">{error}</p>}

            <div className="cabins-list">
                {cabins.map((cabin) => (
                    <div className="cabin-card" key={cabin.id}>
                        <h2>{cabin.name}</h2>
                        <p>{cabin.description}</p>
                        <p>Capacidad: {cabin.capacity} personas</p>
                        <button className="reserve-button" onClick={() => handleReserve(cabin.id)}>
                            Reservar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Cabins
