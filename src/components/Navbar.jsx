import { Link, NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { userInfo, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openAuthModal = (mode) => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const navLink = ({ isActive }) =>
    isActive
      ? "text-yellow-300 font-semibold border-b-2 border-yellow-300 pb-0.5 text-sm"
      : "text-white/80 font-medium hover:text-white transition-colors text-sm";

  const initials = userInfo?.name
    ? userInfo.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <>
      <header
        className="sticky top-0 z-30 shadow-lg"
        style={{
          background: "linear-gradient(135deg, #1c0800 0%, #431407 35%, #7c2d00 65%, #c2410c 100%)",
          borderBottom: "1px solid rgba(251,146,60,0.25)",
        }}
      >
        {menuOpen && (
          <div className="fixed inset-0 bg-black/30 z-20" onClick={() => setMenuOpen(false)} />
        )}

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-6">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="bg-white rounded-2xl p-1.5 shadow-md flex-shrink-0">
              <img src={logo} alt="DriveNow" className="h-10 md:h-11 w-auto object-contain rounded-xl" />
            </div>
            <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
              DriveNow
            </span>
          </Link>

          {/* ── Desktop center nav ── */}
          <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
            <NavLink to="/" className={navLink}>Home</NavLink>
            <a href="#vehicles-section" className="text-white/80 font-medium hover:text-white transition-colors text-sm">
              Browse Vehicles
            </a>
            <a href="#how-it-works" className="text-white/80 font-medium hover:text-white transition-colors text-sm">
              How It Works
            </a>
          </nav>

          {/* ── Desktop right side ── */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {!userInfo ? (
              /* Not logged in — Login + Sign Up buttons */
              <>
                <button
                  onClick={() => openAuthModal("login")}
                  className="text-sm font-semibold text-white/90 hover:text-white px-4 py-2 rounded-xl border border-white/25 hover:border-white/60 hover:bg-white/10 transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => openAuthModal("register")}
                  className="text-sm font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 shadow-sm hover:shadow-md transition-all"
                >
                  Sign Up Free
                </button>
              </>
            ) : (
              /* Logged in — avatar pill dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border-2 transition-all duration-200 ${
                    dropdownOpen
                      ? "border-yellow-300 bg-white/10 shadow-md"
                      : "border-white/30 bg-white/10 hover:border-yellow-300 hover:bg-white/15"
                  }`}
                >
                  {/* Avatar circle with initials */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0">
                    {initials}
                  </div>
                  <div className="text-left leading-tight">
                    <p className="text-xs font-bold text-white max-w-[90px] truncate">
                      {userInfo.name || "My Account"}
                    </p>
                    <p className="text-[10px] text-white/60 capitalize">{userInfo.role}</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    className={`text-white/70 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="profile-dropdown">
                    {/* User header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{userInfo.name || "User"}</p>
                          <p className="text-xs text-slate-400 truncate">{userInfo.email}</p>
                          <span className="inline-block text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full mt-0.5 capitalize">
                            {userInfo.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="dropdown-divider" />

                    <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                      </svg>
                      <span>Dashboard</span>
                    </Link>

                    <Link to="/my-reservations" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span>My Reservations</span>
                    </Link>

                    <Link to="/payment-history" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                      <span>Payment History</span>
                    </Link>

                    <Link to="/my-reviews" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      <span>My Reviews</span>
                    </Link>

                    {(userInfo?.role === "owner" || userInfo?.role === "admin") && (
                      <>
                        <div className="dropdown-divider" />
                        <Link to="/add-vehicle" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                          </svg>
                          <span>Add Vehicle</span>
                        </Link>
                      </>
                    )}

                    {userInfo?.role === "admin" && (
                      <Link to="/admin" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                        </svg>
                        <span>Admin Panel</span>
                      </Link>
                    )}

                    <div className="dropdown-divider" />

                    <button
                      onClick={() => { logout(); setDropdownOpen(false); }}
                      className="dropdown-item dropdown-item-danger w-full text-left"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* ── Mobile slide-down menu ── */}
        <nav
          className={`${menuOpen ? "flex" : "hidden"} absolute top-20 left-0 w-full flex-col items-stretch shadow-2xl md:hidden z-30 divide-y divide-white/10`}
          style={{ background: "linear-gradient(180deg, #431407 0%, #7c2d00 100%)", borderBottom: "1px solid rgba(251,146,60,0.25)" }}
        >
          <NavLink to="/" className="px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors" onClick={() => setMenuOpen(false)}>
            🏠 Home
          </NavLink>

          {userInfo ? (
            <>
              {/* User info header */}
              <div className="px-6 py-3 bg-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{userInfo.name}</p>
                  <p className="text-xs text-white/60">{userInfo.email}</p>
                </div>
              </div>

              <NavLink to="/dashboard" className="px-6 py-3.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white" onClick={() => setMenuOpen(false)}>📊 Dashboard</NavLink>
              <NavLink to="/my-reservations" className="px-6 py-3.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white" onClick={() => setMenuOpen(false)}>📅 My Reservations</NavLink>
              <NavLink to="/payment-history" className="px-6 py-3.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white" onClick={() => setMenuOpen(false)}>💳 Payments</NavLink>
              <NavLink to="/my-reviews" className="px-6 py-3.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white" onClick={() => setMenuOpen(false)}>⭐ My Reviews</NavLink>

              {(userInfo?.role === "owner" || userInfo?.role === "admin") && (
                <NavLink to="/add-vehicle" className="px-6 py-3.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white" onClick={() => setMenuOpen(false)}>➕ Add Vehicle</NavLink>
              )}
              {userInfo?.role === "admin" && (
                <NavLink to="/admin" className="px-6 py-3.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white" onClick={() => setMenuOpen(false)}>⚙️ Admin Panel</NavLink>
              )}

              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="mx-4 my-3 py-2.5 rounded-xl text-sm font-bold text-red-300 border border-red-400/40 hover:bg-red-500/20 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="p-4 flex flex-col gap-2">
              <button
                onClick={() => openAuthModal("login")}
                className="w-full py-3 rounded-xl text-sm font-bold text-white border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all"
              >
                Login
              </button>
              <button
                onClick={() => openAuthModal("register")}
                className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 transition-all shadow-sm"
              >
                Sign Up Free
              </button>
            </div>
          )}
        </nav>
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
}
