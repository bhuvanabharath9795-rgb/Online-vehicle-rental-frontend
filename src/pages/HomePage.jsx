import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import VehicleCard from "../components/VehicleCard";
import carBg from "../assets/home-neon-car-bg.png";

const POPULAR_CITIES = [
  "Chennai", "Mumbai", "Delhi", "Bangalore", "Hyderabad",
  "Pune", "Kolkata", "Ahmedabad",
];

const VEHICLE_TYPE_OPTIONS = [
  {
    value: "", label: "All Types",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  },
  {
    value: "Car", label: "Car",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17h14M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h8l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M5 17a2 2 0 1 0 4 0m6 0a2 2 0 1 0 4 0m-10 0h6"/></svg>,
  },
  {
    value: "Bike", label: "Bike",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/></svg>,
  },
  {
    value: "Scooter", label: "Scooter",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="17" r="3"/><circle cx="17" cy="17" r="3"/><path d="M10 17h4m4-7h2M3 9h6l2 5"/><path d="M16 5a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"/><path d="M16 6c0 2-2 4-2 4h4c1 0 2-1 2-2V6"/></svg>,
  },
  {
    value: "SUV", label: "SUV",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17h18M3 17a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1l3-4h10l2 4h1a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2M3 17a2 2 0 1 0 4 0m10 0a2 2 0 1 0 4 0m-14 0h10"/></svg>,
  },
  {
    value: "Van", label: "Van",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  },
  {
    value: "Truck", label: "Truck",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 5v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  },
];

const VEHICLE_CATEGORIES = [
  {
    label: "Bikes & Scooters",
    types: ["Bike", "Scooter"],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/>
      </svg>
    ),
    seats: "1 Seater",
    color: "from-orange-500 to-amber-400",
    bgLight: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-600",
  },
  {
    label: "Cars & SUVs",
    types: ["Car", "SUV"],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17h14M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h8l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M5 17a2 2 0 1 0 4 0m6 0a2 2 0 1 0 4 0m-10 0h6"/>
      </svg>
    ),
    seats: "4-5 Seater",
    color: "from-blue-500 to-cyan-400",
    bgLight: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-600",
  },
  {
    label: "Vans & Trucks",
    types: ["Van", "Truck"],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    seats: "6+ Seater / Cargo",
    color: "from-emerald-500 to-teal-400",
    bgLight: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-600",
  },
];

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [filters, setFilters] = useState({
    keyword: "",
    type: "",
    location: "",
    minPrice: "",
    maxPrice: "",
  });
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [typeDropdownRect, setTypeDropdownRect] = useState(null);
  const typeDropdownRef = useRef(null);
  const typeButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target) &&
          typeButtonRef.current && !typeButtonRef.current.contains(e.target))
        setTypeDropdownOpen(false);
    };
    const handleScroll = () => setTypeDropdownOpen(false);
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const openTypeDropdown = () => {
    if (!typeDropdownOpen && typeButtonRef.current) {
      setTypeDropdownRect(typeButtonRef.current.getBoundingClientRect());
    }
    setTypeDropdownOpen((prev) => !prev);
  };

  const fetchVehicles = async (overrideFilters) => {
    try {
      setLoading(true);
      const active = overrideFilters ?? filters;
      const params = {};
      Object.keys(active).forEach((key) => {
        if (active[key] !== "") params[key] = active[key];
      });
      const query = new URLSearchParams(params).toString();
      const { data } = await api.get(query ? `/vehicles?${query}` : "/vehicles");
      setVehicles(Array.isArray(data) ? data : data.vehicles || []);
    } catch {
      toast.error("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVehicles(); }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    fetchVehicles();
  };

  const selectCity = (city) => {
    const next = { ...filters, location: city };
    setFilters(next);
    fetchVehicles(next);
    document.getElementById("vehicles-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const getVehiclesByCategory = (types) =>
    vehicles.filter((v) => types.some((t) => t.toLowerCase() === (v.type || "").toLowerCase()));

  const getDisplayedVehicles = () => {
    if (activeCategory === null) return vehicles;
    const cat = VEHICLE_CATEGORIES[activeCategory];
    return cat ? getVehiclesByCategory(cat.types) : vehicles;
  };

  const displayedVehicles = getDisplayedVehicles();

  return (
    <div className="homepage-bg space-y-8 px-2 md:px-0">
      <div className="homepage-shapes">
        <div className="homepage-shape" /><div className="homepage-shape" /><div className="homepage-shape" />
      </div>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden rounded-3xl text-white shadow-2xl"
        style={{ background: "linear-gradient(135deg, #e65100 0%, #f57c00 30%, #ff9800 60%, #ffb74d 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute left-1/3 -top-6 h-20 w-20 rounded-full bg-yellow-300/20 pointer-events-none" />

        {/* Top row: text + car */}
        <div className="flex items-end">
          <div className="flex-1 px-8 pt-10 pb-6 md:px-12 md:pt-12 md:pb-8 relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-1.5 text-sm font-semibold mb-4 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
              India's Trusted Vehicle Rental Platform
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
              Find your<br />perfect ride
            </h1>
            <p className="mt-3 text-base md:text-lg opacity-90 max-w-md">
              Book cars, bikes, vans and trucks instantly — across 50+ cities in India.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {["No hidden charges", "Instant confirmation", "Free cancellation"].map((b) => (
                <span key={b} className="flex items-center gap-1.5 bg-white/20 border border-white/25 rounded-full px-3 py-1 text-sm font-medium backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Car image — screen blend removes black bg */}
          <div className="hidden md:flex items-end flex-shrink-0 self-end">
            <img
              src={carBg}
              alt="rental car"
              className="h-64 lg:h-80 xl:h-96 w-auto object-contain object-bottom"
              style={{ filter: "brightness(2.2) contrast(0.75)", mixBlendMode: "screen" }}
            />
          </div>
        </div>

        {/* Embedded Search Bar — Zoomcar style */}
        <form
          onSubmit={submitHandler}
          className="relative z-10 mx-6 mb-6 md:mx-10 md:mb-8 bg-white rounded-2xl shadow-2xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 rounded-2xl overflow-hidden">
            {/* City / Location */}
            <div className="flex items-center gap-3 px-4 py-3 lg:col-span-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500 flex-shrink-0">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">City</p>
                <input
                  className="w-full text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
                  placeholder="Enter city or location"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </div>
            </div>

            {/* Vehicle Type — custom dropdown */}
            <div className="lg:col-span-1">
              <button
                ref={typeButtonRef}
                type="button"
                onClick={openTypeDropdown}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50/50 transition-colors text-left"
              >
                <span className="text-orange-500 flex-shrink-0">
                  {VEHICLE_TYPE_OPTIONS.find((o) => o.value === filters.type)?.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vehicle Type</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {VEHICLE_TYPE_OPTIONS.find((o) => o.value === filters.type)?.label || "All Types"}
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${typeDropdownOpen ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {/* Custom dropdown panel — fixed so overflow-hidden can't clip it */}
              {typeDropdownOpen && typeDropdownRect && (
                <div
                  ref={typeDropdownRef}
                  className="fixed w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-[9999]"
                  style={{
                    top: typeDropdownRect.bottom + 8,
                    left: typeDropdownRect.left,
                    animation: "dropdownSlideIn 0.18s ease-out",
                  }}
                >
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                    Select vehicle type
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {VEHICLE_TYPE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setFilters({ ...filters, type: opt.value });
                          setTypeDropdownOpen(false);
                        }}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                          filters.type === opt.value
                            ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-md shadow-orange-200"
                            : "text-slate-700 hover:bg-orange-50 hover:text-orange-600 border border-transparent hover:border-orange-100"
                        }`}
                      >
                        <span className={filters.type === opt.value ? "text-white" : "text-orange-400"}>
                          {opt.icon}
                        </span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Keyword */}
            <div className="flex items-center gap-3 px-4 py-3 lg:col-span-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500 flex-shrink-0">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Make / Model</p>
                <input
                  className="w-full text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
                  placeholder="e.g. Honda, Swift"
                  value={filters.keyword}
                  onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                />
              </div>
            </div>

            {/* Budget */}
            <div className="flex items-center gap-3 px-4 py-3 lg:col-span-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500 flex-shrink-0">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Max Budget / Day</p>
                <input
                  type="number"
                  className="w-full text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
                  placeholder="e.g. 2000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                />
              </div>
            </div>

            {/* Search button */}
            <button
              type="submit"
              className="lg:col-span-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold text-base transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Search
            </button>
          </div>
        </form>
      </section>

      {/* ── POPULAR CITIES ── */}
      <div>
        <p className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Popular Cities</p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_CITIES.map((city) => (
            <button
              key={city}
              onClick={() => selectCity(city)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-200 ${
                filters.location === city
                  ? "bg-orange-500 text-white border-orange-500 shadow-md"
                  : "bg-white text-slate-700 border-slate-200 hover:border-orange-400 hover:text-orange-600"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {city}
            </button>
          ))}
          {filters.location && !POPULAR_CITIES.includes(filters.location) && (
            <button
              onClick={() => { setFilters({ ...filters, location: "" }); fetchVehicles({ ...filters, location: "" }); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold bg-orange-50 text-orange-600 border-orange-300"
            >
              ✕ Clear city
            </button>
          )}
        </div>
      </div>

      {/* ── TRUST STATS ── */}
      <div
        className="rounded-3xl overflow-hidden shadow-lg"
        style={{ background: "linear-gradient(135deg, #7c2d00 0%, #c2410c 40%, #ea580c 70%, #f97316 100%)" }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {[
            { value: "500+",  label: "Vehicles Available",
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17h14M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h8l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M5 17a2 2 0 1 0 4 0m6 0a2 2 0 1 0 4 0m-10 0h6"/></svg> },
            { value: "50+",   label: "Cities Covered",
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
            { value: "10K+",  label: "Happy Customers",
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
            { value: "4.8 ★", label: "Average Rating",
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2 px-6 py-6 text-center text-white group hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                {stat.icon}
              </div>
              <p className="text-3xl font-extrabold tracking-tight">{stat.value}</p>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-75">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORY CARDS ── */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-extrabold text-slate-900">Browse by Category</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {VEHICLE_CATEGORIES.map((cat, idx) => {
            const count = getVehiclesByCategory(cat.types).length;
            const isActive = activeCategory === idx;
            const isEmpty = count === 0;
            return (
              <button
                key={cat.label}
                onClick={() => !isEmpty && setActiveCategory(isActive ? null : idx)}
                disabled={isEmpty}
                className={`category-card group relative ${
                  isEmpty
                    ? "opacity-50 cursor-not-allowed bg-slate-50 border-slate-200"
                    : `${isActive ? "category-card-active" : ""} ${cat.bgLight} ${cat.borderColor}`
                }`}
              >
                <div className={`category-icon-wrap bg-gradient-to-br ${isEmpty ? "from-slate-300 to-slate-400" : cat.color}`}>
                  {cat.icon}
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-slate-900 text-base">{cat.label}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.seats}</p>
                </div>
                <div className="text-right">
                  {isEmpty ? (
                    <>
                      <p className="text-xs font-semibold text-slate-400">Coming</p>
                      <p className="text-xs text-slate-400">soon</p>
                    </>
                  ) : (
                    <>
                      <span className={`text-2xl font-extrabold ${cat.textColor}`}>{count}</span>
                      <p className="text-xs text-slate-400">vehicles</p>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── ACTIVE FILTER PILL ── */}
      {(activeCategory !== null || filters.location) && (
        <div className="flex flex-wrap items-center gap-2 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 border border-orange-100 shadow-sm">
          <span className="text-sm text-slate-500 font-medium">Filters:</span>
          {activeCategory !== null && (
            <span className="flex items-center gap-1.5 text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full">
              {VEHICLE_CATEGORIES[activeCategory].label}
              <button onClick={() => setActiveCategory(null)} className="hover:text-orange-900">✕</button>
            </span>
          )}
          {filters.location && (
            <span className="flex items-center gap-1.5 text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full">
              📍 {filters.location}
              <button onClick={() => { const f = { ...filters, location: "" }; setFilters(f); fetchVehicles(f); }} className="hover:text-orange-900">✕</button>
            </span>
          )}
        </div>
      )}

      {/* ── VEHICLES ── */}
      <div id="vehicles-section">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-orange-500 font-medium mt-3">Finding vehicles…</p>
          </div>
        ) : activeCategory === null ? (
          VEHICLE_CATEGORIES.map((cat) => {
            const catVehicles = getVehiclesByCategory(cat.types);
            if (catVehicles.length === 0) return null;
            return (
              <div key={cat.label} className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-white`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{cat.label}</h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cat.bgLight} ${cat.textColor}`}>
                    {cat.seats} · {catVehicles.length} available
                  </span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catVehicles.map((v) => <VehicleCard key={v._id} vehicle={v} />)}
                </div>
              </div>
            );
          })
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-extrabold text-slate-900">{VEHICLE_CATEGORIES[activeCategory].label}</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedVehicles.length === 0 ? (
                <p className="col-span-3 text-center text-slate-500 py-8">No vehicles found in this category</p>
              ) : (
                displayedVehicles.map((v) => <VehicleCard key={v._id} vehicle={v} />)
              )}
            </div>
          </div>
        )}

        {!loading && vehicles.length === 0 && (
          <div className="empty-state py-14">
            <div className="text-5xl mb-3">🚗</div>
            <p className="font-semibold text-slate-700 text-lg">No vehicles found</p>
            <p className="text-sm mt-1">Try a different city or adjust your filters.</p>
          </div>
        )}
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="pt-4">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900">How It Works</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              step: "01", title: "Search & Filter",
              desc: "Browse hundreds of verified vehicles by type, location, and price. Find exactly what fits your trip.",
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
              color: "from-orange-500 to-amber-400", bg: "bg-orange-50", border: "border-orange-100",
            },
            {
              step: "02", title: "Book Instantly",
              desc: "Select your pickup and return dates, confirm your booking in seconds, and pay securely online.",
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
              color: "from-blue-500 to-cyan-400", bg: "bg-blue-50", border: "border-blue-100",
            },
            {
              step: "03", title: "Drive & Enjoy",
              desc: "Pick up your vehicle, hit the road, and return it when done. Leave a review to help other travellers.",
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17h14M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h8l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M5 17a2 2 0 1 0 4 0m6 0a2 2 0 1 0 4 0m-10 0h6"/></svg>,
              color: "from-emerald-500 to-teal-400", bg: "bg-emerald-50", border: "border-emerald-100",
            },
          ].map((item) => (
            <div key={item.step} className={`${item.bg} ${item.border} border-2 rounded-2xl p-6 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}>
              <span className="absolute top-4 right-5 text-5xl font-black opacity-[0.06] text-slate-900 select-none">{item.step}</span>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4`}>{item.icon}</div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900">Why Choose DriveNow?</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: "🔐", title: "Secure & Verified", desc: "Every vehicle and owner is verified before listing. Book with confidence knowing your safety is our priority." },
            { icon: "💰", title: "Best Price Guarantee", desc: "Transparent pricing with no hidden fees. Compare models and get the best deal for your budget." },
            { icon: "📍", title: "Pick Up Anywhere", desc: "Vehicles available across 50+ cities in India. Pickup from locations nearest to you." },
            { icon: "⚡", title: "Instant Confirmation", desc: "No waiting. Your booking is confirmed the moment you pay — get your invoice immediately." },
            { icon: "🛡️", title: "Insurance Covered", desc: "All rentals include basic insurance coverage so you can drive without worry." },
            { icon: "🌟", title: "Rated by Real Users", desc: "Genuine reviews from real renters help you pick the best vehicle for your journey." },
          ].map((f) => (
            <div key={f.title} className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-2xl p-5 flex gap-4 items-start hover:border-orange-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <div className="text-3xl flex-shrink-0">{f.icon}</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA BANNER ── */}
      <section
        className="rounded-3xl relative overflow-hidden text-white shadow-2xl"
        style={{ background: "linear-gradient(135deg, #431407 0%, #9a3412 30%, #ea580c 65%, #f97316 100%)" }}
      >
        {/* Decorative grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Decorative orbs */}
        <div className="absolute -right-24 -top-24 w-72 h-72 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute right-1/3 -bottom-8 w-32 h-32 bg-yellow-300/10 rounded-full pointer-events-none" />

        <div className="relative z-10 px-8 py-14 text-center">
          <span className="inline-block bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-sm font-semibold mb-5 backdrop-blur-sm">
            🚀 Over 10,000 rides and counting
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
            Ready to Hit the Road?
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-10 max-w-xl mx-auto leading-relaxed">
            Join thousands of happy customers who trust DriveNow for every journey — from quick city runs to long road trips.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => document.getElementById("vehicles-section")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 bg-white text-orange-600 font-extrabold rounded-2xl text-base hover:bg-orange-50 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              Browse Vehicles
            </button>
            <a
              href="#how-it-works"
              className="px-8 py-4 border-2 border-white/50 text-white font-bold rounded-2xl text-base hover:bg-white/10 hover:border-white transition-all duration-300"
            >
              How It Works
            </a>
          </div>
          {/* Mini trust pills */}
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            {["No hidden charges", "Instant confirmation", "Free cancellation"].map((b) => (
              <span key={b} className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
