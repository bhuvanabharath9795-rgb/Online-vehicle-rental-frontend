import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { userInfo, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

 

  const navClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
      : "text-slate-700 font-medium hover:text-blue-600";

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-sm">
       {menuOpen && (
      <div
        className="fixed inset-0 bg-black/30 z-20"
        onClick={() => setMenuOpen(false)}
      />
    )}
      <div className="w-full max-w-7xl mx-auto px-4 h-24 flex items-center justify-between relative">
      <Link to="/" className="flex items-center gap-3">
    <img src={logo} alt="vehicleRent Logo" className="h-16 md:h-24 w-auto object-contain" />
      <button
  className="md:hidden text-3xl font-bold text-blue-700"
  onClick={() => setMenuOpen(!menuOpen)}
>
  ☰
</button>

      <span className="text-xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
  VehicleRent
</span>
    </Link>

      <nav
  className={`${
    menuOpen ? "flex" : "hidden"
  } absolute top-24 left-0 w-full bg-white flex-col items-center gap-4 py-5 shadow-md md:static md:flex md:flex-row md:w-auto md:shadow-none md:py-0`}
>
          <NavLink to="/" className={navClass}  onClick={() => setMenuOpen(false)}>Home</NavLink>
{userInfo ? (
  <>
    {userInfo?.role === "user" && (
      <>
        <NavLink to="/dashboard" className={navClass}  onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
        <NavLink to="/my-reservations" className={navClass}  onClick={() => setMenuOpen(false)}>My Reservations</NavLink>
        <NavLink to="/payment-history" className={navClass} onClick={() => setMenuOpen(false)}>Payments</NavLink>
        <NavLink to="/my-reviews" className={navClass} onClick={() => setMenuOpen(false)}>Reviews</NavLink>
      </>
    )}

              {(userInfo?.role === "owner" || userInfo?.role === "admin") && (
                <NavLink to="/add-vehicle" className={navClass} >
                  Add Vehicle
                </NavLink>
              )}

              {userInfo?.role === "admin" && (
                <NavLink to="/admin" className={navClass} >
                  Admin
                </NavLink>
              )}

              <button onClick={logout} className="text-red-600 font-semibold hover:underline">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass}>Login</NavLink>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}