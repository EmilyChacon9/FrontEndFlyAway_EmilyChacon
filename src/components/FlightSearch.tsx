import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import type { Flight } from "../types";

function FlightSearch() {
  const navigate = useNavigate();
  const [flightNumber, setFlightNumber] = useState("");
  const [airlineName, setAirlineName] = useState("");
  const [estDepartureTimeFrom, setEstDepartureTimeFrom] = useState("");
  const [estDepartureTimeTo, setEstDepartureTimeTo] = useState("");

  const [flights, setFlights] = useState<Flight[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);

  const isAuthenticated = !!localStorage.getItem("token");

  useEffect(() => {
    const loadInitialFlights = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/flights");
        setFlights(response.data);
      } catch (err: any) {
        const status = err.response?.status;
        const detail = err.response?.data?.detail;
        if (status) {
          setError(`Error ${status}: ${detail ?? "No se pudieron cargar los vuelos."}`);
        } else {
          setError("No se puede conectar al servidor. ¿Está corriendo en el puerto 8080?");
        }
      } finally {
        setLoading(false);
      }
    };
    loadInitialFlights();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBookingStatus(null);
    setLoading(true);

    try {
      const fromDate = estDepartureTimeFrom
        ? new Date(estDepartureTimeFrom).toISOString().split(".")[0] + "Z"
        : undefined;
      const toDate = estDepartureTimeTo
        ? new Date(estDepartureTimeTo).toISOString().split(".")[0] + "Z"
        : undefined;

      const response = await api.get("/flights/search", {
        params: {
          flightNumber: flightNumber.trim() || undefined,
          airlineName: airlineName.trim() || undefined,
          estDepartureTimeFrom: fromDate,
          estDepartureTimeTo: toDate,
        },
      });

      setFlights(response.data.items ?? []);
    } catch (err: any) {
      setError(err.response?.data?.detail ?? "Error al buscar vuelos.");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (flightId: number) => {
  setError(null);
  setBookingStatus(null);

  if (!isAuthenticated) {
    setError("Debes iniciar sesión para reservar un vuelo.");
    return;
  }

  try {
    const response = await api.post("/flights/book", { flightId });
    const newBookingId = response.data.id;

    const saved: number[] = JSON.parse(localStorage.getItem("bookingIds") || "[]");
    if (!saved.includes(newBookingId)) {
      saved.push(newBookingId);
      localStorage.setItem("bookingIds", JSON.stringify(saved));
    }

    setBookingStatus(`¡Reserva exitosa! Tu ID de reserva es: #${newBookingId}`);
    navigate(`/flights/book/${newBookingId}`);
  } catch (err: any) {
    setError(err.response?.data?.detail ?? "No se pudo procesar la reserva.");
  }
};

  return (
    <div className="search-container">
      <h2>Buscar Vuelos</h2>

      {error && <div className="alert-error">ERROR: {error}</div>}
      {bookingStatus && <div className="alert-success">{bookingStatus}</div>}

      <form onSubmit={handleSearch} className="filter-form">
        <div className="filter-group">
          <label>N° de Vuelo:</label>
          <input
            type="text"
            placeholder="Ej. LA202"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Aerolínea:</label>
          <input
            type="text"
            placeholder="Ej. LATAM"
            value={airlineName}
            onChange={(e) => setAirlineName(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Salida Desde:</label>
          <input
            type="datetime-local"
            value={estDepartureTimeFrom}
            onChange={(e) => setEstDepartureTimeFrom(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Salida Hasta:</label>
          <input
            type="datetime-local"
            value={estDepartureTimeTo}
            onChange={(e) => setEstDepartureTimeTo(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      <h3>Resultados disponibles</h3>
      {flights.length === 0 ? (
        <div className="empty-history-message">
          No se encontraron vuelos para esta búsqueda.
        </div>
      ) : (
        <table className="flights-table">
          <thead>
            <tr>
              <th>N° Vuelo</th>
              <th>Aerolínea</th>
              <th>Salida</th>
              <th>Llegada</th>
              <th>Asientos Disp.</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr key={flight.id}>
                <td>{flight.flightNumber}</td>
                <td>{flight.airlineName ?? "N/A"}</td>
                <td>
                  {flight.estDepartureTime
                    ? new Date(flight.estDepartureTime).toLocaleString()
                    : "N/A"}
                </td>
                <td>
                  {flight.estArrivalTime
                    ? new Date(flight.estArrivalTime).toLocaleString()
                    : "N/A"}
                </td>
                <td>{flight.availableSeats ?? "N/A"}</td>
                <td>
                  {isAuthenticated ? (
                    <button
                      onClick={() => handleBook(flight.id)}
                      className="btn-book"
                    >
                      Reservar
                    </button>
                  ) : (
                    <span style={{ color: "gray", fontSize: "0.85rem" }}>
                      Inicia sesión
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FlightSearch;