import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import BookingForm from "../components/BookingForm";
import ReviewList from "../components/ReviewList";
import MaintenanceList from "../components/MaintenanceList";
import { useAuth } from "../context/AuthContext";
import neonCar from "../assets/home-neon-car-bg.png";

const SPEC_ITEMS = [
  { key: "make",         label: "Make",         icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, color: "text-blue-500", bg: "bg-blue-50 border-blue-100" },
  { key: "model",        label: "Model",         icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17h14M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h8l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M5 17a2 2 0 1 0 4 0m6 0a2 2 0 1 0 4 0m-10 0h6"/></svg>, color: "text-purple-500", bg: "bg-purple-50 border-purple-100" },
  { key: "year",         label: "Year",          icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, color: "text-green-500", bg: "bg-green-50 border-green-100" },
  { key: "type",         label: "Type",          icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>, color: "text-orange-500", bg: "bg-orange-50 border-orange-100" },
  { key: "location",     label: "Location",      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, color: "text-red-500", bg: "bg-red-50 border-red-100" },
  { key: "fuelType",     label: "Fuel",          icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22V6l8-4 8 4v16"/><path d="M14 22V12H10v10"/><path d="M10 6h4"/></svg>, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-100" },
  { key: "transmission", label: "Transmission",  icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="19" cy="12" r="2"/><path d="M12 7v10M5 14l7-2 7 2"/></svg>, color: "text-slate-600", bg: "bg-slate-50 border-slate-200" },
  { key: "seats",        label: "Seats",         icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>, color: "text-teal-500", bg: "bg-teal-50 border-teal-100" },
];

const FALLBACK_IMG = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop";

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="w-full h-80 bg-slate-200 rounded-3xl" />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-10 bg-slate-200 rounded-xl w-2/3" />
          <div className="h-4 bg-slate-100 rounded w-full" />
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-20 bg-slate-100 rounded-2xl" />)}
          </div>
        </div>
        <div className="h-64 bg-slate-100 rounded-2xl" />
      </div>
    </div>
  );
}

export default function VehicleDetailsPage() {
  const { id } = useParams();
  const { userInfo } = useAuth();
  const [data, setData] = useState({ vehicle: null, reviews: [], maintenanceRecords: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/vehicles/${id}`);
        setData(res.data);
      } catch {
        toast.error("Failed to load vehicle");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <LoadingSkeleton />;
  if (!data.vehicle) return (
    <div className="empty-state py-20">
      <p className="font-medium">Vehicle not found.</p>
    </div>
  );

  const { vehicle, reviews, maintenanceRecords } = data;
  const make  = vehicle.make || vehicle.brand || "";
  const model = vehicle.model || "";
  const title = vehicle.title || `${make} ${model}`.trim();
  const vehicleImage =
    vehicle.image ||
    (Array.isArray(vehicle.images) ? vehicle.images[0] : vehicle.images) ||
    FALLBACK_IMG;

  const specValue = (key) => {
    if (key === "make") return make || null;
    if (key === "model") return model || null;
    const v = vehicle[key];
    return v !== undefined && v !== null && v !== "" ? v : null;
  };

  const availableSpecs = SPEC_ITEMS.filter(({ key }) => specValue(key) !== null);

  return (
    <div className="space-y-6 relative">
      {/* Page background — neon car + gradient orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Warm radial glow behind the car */}
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle at 70% 80%, rgba(251,146,60,0.18) 0%, transparent 65%)" }} />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle at 30% 20%, rgba(250,204,21,0.12) 0%, transparent 65%)" }} />

        {/* Dot grid */}
        <div className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle, rgba(234,88,12,0.055) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* Neon car — centered, screen blend so dark bg disappears */}
        <img
          src={neonCar}
          alt=""
          className="absolute top-1/2 left-1/2 w-[75vw] max-w-4xl object-contain select-none"
          style={{
            transform: "translate(-50%, -50%)",
            mixBlendMode: "screen",
            filter: "brightness(3) contrast(0.65) saturate(1.3)",
            opacity: 0.5,
          }}
        />
      </div>

      {/* ── HERO IMAGE ── */}
      <div className="relative w-full h-72 md:h-96 rounded-3xl overflow-hidden shadow-2xl">
        <img
          src={vehicleImage}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back link */}
        <Link
          to="/"
          className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-semibold px-3 py-2 rounded-xl transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </Link>

        {/* Type badge */}
        {vehicle.type && (
          <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            {vehicle.type}
          </span>
        )}

        {/* Bottom info bar */}
        <div className="absolute bottom-0 inset-x-0 px-6 py-5 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg leading-tight">
              {title}
            </h1>
            {vehicle.location && (
              <p className="text-white/80 text-sm mt-1 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {vehicle.location}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-3xl font-extrabold text-white drop-shadow-lg">
              ₹{vehicle.pricePerDay?.toLocaleString("en-IN") || 0}
            </p>
            <p className="text-white/70 text-sm">/day</p>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Rating + description card */}
          <div className="card p-6 space-y-4">
            {/* Rating row */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-2.5">
                <span className="text-yellow-500 text-xl">★</span>
                <span className="font-extrabold text-slate-800 text-lg">
                  {vehicle.averageRating?.toFixed(1) || "—"}
                </span>
                <span className="text-slate-400 text-sm">({vehicle.totalReviews || 0} reviews)</span>
              </div>
              {vehicle.isAvailable !== false && (
                <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-3 py-2 rounded-full">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Available Now
                </span>
              )}
            </div>

            {/* Description */}
            {vehicle.description && (
              <div className="border-l-4 border-orange-400 pl-4">
                <p className="text-slate-600 leading-relaxed">{vehicle.description}</p>
              </div>
            )}
          </div>

          {/* Specs card */}
          {availableSpecs.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">Specifications</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableSpecs.map(({ key, label, icon, color, bg }) => (
                  <div
                    key={key}
                    className={`border rounded-2xl px-4 py-3.5 flex items-start gap-3 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${bg}`}
                  >
                    <div className={`mt-0.5 flex-shrink-0 ${color}`}>{icon}</div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                      <p className="font-bold text-slate-800 text-sm capitalize truncate mt-0.5">
                        {specValue(key)}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Price tile */}
                <div className="border border-orange-200 rounded-2xl px-4 py-3.5 flex items-start gap-3 bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                  <div className="mt-0.5 flex-shrink-0 text-orange-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-orange-400">Price / Day</p>
                    <p className="font-extrabold text-orange-600 text-base mt-0.5">
                      ₹{vehicle.pricePerDay?.toLocaleString("en-IN") || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Maintenance */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900">Maintenance Records</h2>
            </div>
            {maintenanceRecords.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                </div>
                <p className="text-slate-500 font-medium">No maintenance records</p>
                <p className="text-slate-400 text-sm mt-0.5">This vehicle is well maintained</p>
              </div>
            ) : (
              <MaintenanceList records={maintenanceRecords} />
            )}
          </div>

          {/* Reviews */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900">User Reviews</h2>
              {reviews.length > 0 && (
                <span className="ml-auto text-sm font-semibold text-slate-400">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
              )}
            </div>
            {reviews.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-yellow-50 border border-yellow-100 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-300"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <p className="text-slate-500 font-medium">No reviews yet</p>
                <p className="text-slate-400 text-sm mt-0.5">Be the first to review this vehicle</p>
              </div>
            ) : (
              <ReviewList reviews={reviews} />
            )}
          </div>

        </div>

        {/* Right: Booking sidebar */}
        <div className="lg:sticky lg:top-28 self-start space-y-4">
          {/* Price summary pill */}
          <div
            className="rounded-2xl p-4 text-white flex items-center justify-between shadow-lg"
            style={{ background: "linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #f97316 100%)" }}
          >
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Rental Price</p>
              <p className="text-3xl font-extrabold">₹{vehicle.pricePerDay?.toLocaleString("en-IN") || 0}</p>
              <p className="text-white/70 text-xs">per day · all inclusive</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17h14M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h8l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M5 17a2 2 0 1 0 4 0m6 0a2 2 0 1 0 4 0m-10 0h6"/></svg>
            </div>
          </div>

          {userInfo ? (
            <BookingForm vehicle={vehicle} />
          ) : (
            <div className="card p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-lg">Login to Book</p>
                <p className="text-sm text-slate-500 mt-1">Sign in to reserve this vehicle instantly.</p>
              </div>
              <Link
                to="/login"
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold text-sm hover:from-orange-600 hover:to-yellow-600 transition-all shadow-md"
              >
                Sign In to Continue
              </Link>
            </div>
          )}

          {/* Trust badges */}
          <div className="card p-4 space-y-2.5">
            {[
              { icon: "🔒", text: "Secure & verified listing" },
              { icon: "⚡", text: "Instant booking confirmation" },
              { icon: "🛡️", text: "Basic insurance included" },
              { icon: "📞", text: "24/7 support available" },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-2.5 text-sm text-slate-600">
                <span className="text-base">{b.icon}</span>
                {b.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
