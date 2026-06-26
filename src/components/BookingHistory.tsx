import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

import type { BookingDetail } from "../types";


function BookingHistory() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    api.get(`/flights/book/${id}`)
      .then((res) => setBooking(res.data))
      .catch((err) => {
        setError(err.response?.data?.detail ?? "No se pudo cargar la reserva.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Cargando datos de la reserva...</p>;

  return (
    <div className="search-container">
      <h2>Confirmación de Reserva</h2>
      {error && <div className="alert-error">ERROR: {error}</div>}

      {!booking ? (
        <div className="empty-history-message">
          No se encontró la reserva solicitada.
        </div>
      ) : (
        <div className="booking-card">
          <div className="card-header">
            <span>Reserva N°: {booking.id}</span>
          </div>
          <hr />
          <p><strong>Vuelo:</strong> {booking.flightNumber}</p>
          <p>
            <strong>Pasajero:</strong> {booking.customerFirstName}{" "}
            {booking.customerLastName}
          </p>
          <p>
            <strong>Fecha de Salida:</strong>{" "}
            {booking.estDepartureTime
              ? new Date(booking.estDepartureTime).toLocaleString()
              : "N/A"}
          </p>
          <p>
            <strong>Fecha de Llegada:</strong>{" "}
            {booking.estArrivalTime
              ? new Date(booking.estArrivalTime).toLocaleString()
              : "N/A"}
          </p>
          <p className="meta-date">
            Emitida el:{" "}
            {booking.bookingDate
              ? new Date(booking.bookingDate).toLocaleString()
              : "N/A"}
          </p>
        </div>
      )}
    </div>
  );
}

export default BookingHistory;