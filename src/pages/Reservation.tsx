import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './styles/Reservation.css';

function Reservation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await fetch('https://aike-api.onrender.com/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          cabinId: parseInt(id || '0', 10),
          startDate,
          endDate,
          guests
        })
      });
      if (!res.ok) throw new Error('Error');
      const data = await res.json();
      if (data && data.init_point) {
        window.location.href = data.init_point;
      } else {
        navigate('/');
      }
    } catch {
      setError('Error al crear la reserva');
    }
  };

  return (
    <div className="reservation-container">
      <h2>Reservar cabaña {id}</h2>
      <form onSubmit={handleSubmit} className="reservation-form">
        <label>
          Fecha de llegada
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        </label>
        <label>
          Fecha de salida
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
        </label>
        <label>
          Huéspedes
          <input type="number" min="1" max="10" value={guests} onChange={e => setGuests(parseInt(e.target.value, 10))} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Continuar con pago</button>
      </form>
    </div>
  );
}

export default Reservation;
