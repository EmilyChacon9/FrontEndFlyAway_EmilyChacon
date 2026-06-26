import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Register from "./components/Register";
import LogIn from "./components/Login";
import FlightSearch from "./components/FlightSearch";
import BookingHistory from "./components/BookingHistory";
import BookingHistoryList from "./components/BookingHistoryList";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function NavigationBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("bookingIds");
    navigate("/auth/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        {!token && (
          <>
            <Link to="/users/register" className="nav-link">Registrarse</Link>
            <Link to="/auth/login" className="nav-link">Iniciar Sesión</Link>
          </>
        )}
        <Link to="/flights/search" className="nav-link nav-link-bold">
          Buscar Vuelos
        </Link>
        {token && (
          <Link to="/bookings" className="nav-link nav-link-bold">
            Mis Reservas
          </Link>
        )}
      </div>

      {token && (
        <button onClick={handleLogout} className="btn-logout">
          Cerrar Sesión
        </button>
      )}
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <div className="app-content">
        <Routes>
          <Route path="/users/register" element={<Register />} />
          <Route path="/auth/login" element={<LogIn />} />
          <Route path="/flights/search" element={<FlightSearch />} />

          <Route
            path="/flights/book/:id"
            element={
              <ProtectedRoute>
                <BookingHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <BookingHistoryList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;