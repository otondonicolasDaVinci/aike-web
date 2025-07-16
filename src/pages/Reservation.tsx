import BackButton from "../components/BackButton";
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './styles/Reservation.css';

const API_URL = import.meta.env.VITE_API_BASE_URL;

function decodeToken(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
}

function Reservation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let role = localStorage.getItem('role');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState('1');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }
    if (!role) {
      try {
        role = JSON.parse(atob(token.split('.')[1])).r;
      } catch {
        role = null;
      }
    }
    if (role !== 'CLIENT') {
      alert('Solo los clientes pueden realizar reservas');
      return;
    }
    const payload = decodeToken(token);
    const userId = payload?.s;
    try {
      const res = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: { id: Number(userId) },
          cabin: { id: parseInt(id || '0', 10) },
          startDate,
          endDate,
          guests: parseInt(guests, 10),
          status: 'PENDING',
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Error');
      }
      const reservation = await res.json();

      const nights =
        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        86400000;
      const amount = nights > 0 ? nights * 100 : 100;

      const paymentRes = await fetch(
        `${API_URL}/api/payments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reservationId: reservation.id,
            amount,
          }),
        }
      );
      if (!paymentRes.ok) {
        const text = await paymentRes.text();
        throw new Error(text || 'Error');
      }
      const payment = await paymentRes.json();
      if (payment && payment.detail) {
        window.location.href = payment.detail;
      } else {
        navigate('/');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear la reserva';
      setError(message);
    }
  };

  return (
    <div className="reservation-container">
  <BackButton />
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
          <input
            type="number"
            min="1"
            max="10"
            value={guests}
            onChange={e => setGuests(e.target.value)}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Continuar con pago</button>
      </form>
    </div>
  );
}

export default Reservation;

