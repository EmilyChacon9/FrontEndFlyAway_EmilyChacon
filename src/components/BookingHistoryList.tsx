import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import type { BookingDetail } from "../types";


function BookingHistoryList() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingDetail[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllBookings = async () => {
      setLoading(true);
      setError(null);

      const savedIds: number[] = JSON.parse(
        localStorage.getItem("bookingIds") || "[]"
      );

      if (savedIds.length === 0) {
        setLoading(false);
        return;
      }

      const results = await Promise.allSettled(
        savedIds.map((id) => api.get(`/flights/book/${id}`))
      );

      const loaded: BookingDetail[] = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => (r as PromiseFulfilledResult<any>).value.data);

      setBookings(loaded);
      setLoading(false);
    };

    fetchAllBookings();
  }, []);

  if (loading) return <p>Cargando historial de reservas...</p>;

  return (
    <div className="search-container">
      <h2>Mis Reservas</h2>
      {error && <div className="alert-error">ERROR: {error}</div>}

      {bookings.length === 0 ? (
        <div className="empty-history-message">
          No tienes reservas registradas aún.
        </div>
      ) : (
        <table className="flights-table">
          <thead>
            <tr>
              <th>N° Reserva</th>
              <th>Vuelo</th>
              <th>Pasajero</th>
              <th>Salida</th>
              <th>Llegada</th>
              <th>Fecha Emisión</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>#{booking.id}</td>
                <td>{booking.flightNumber}</td>
                <td>
                  {booking.customerFirstName} {booking.customerLastName}
                </td>
                <td>
                  {booking.estDepartureTime
                    ? new Date(booking.estDepartureTime).toLocaleString()
                    : "N/A"}
                </td>
                <td>
                  {booking.estArrivalTime
                    ? new Date(booking.estArrivalTime).toLocaleString()
                    : "N/A"}
                </td>
                <td>
                  {booking.bookingDate
                    ? new Date(booking.bookingDate).toLocaleString()
                    : "N/A"}
                </td>
                <td>
                  <button
                    className="btn-book"
                    onClick={() => navigate(`/flights/book/${booking.id}`)}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BookingHistoryList;