import { Link } from "react-router-dom";

const FALLBACK =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop";

export default function VehicleCard({ vehicle }) {
  const vehicleName =
    vehicle.title ||
    vehicle.name ||
    `${vehicle.make || vehicle.brand || ""} ${vehicle.model || ""}`.trim() ||
    vehicle.type ||
    "Vehicle";

  const vehicleImage =
    vehicle.image ||
    (Array.isArray(vehicle.images) ? vehicle.images[0] : vehicle.images) ||
    FALLBACK;

  const rating = vehicle.averageRating?.toFixed(1) ?? "—";
  const reviews = vehicle.totalReviews || 0;

  return (
    <div className="group card overflow-hidden card-hover border-orange-100 flex flex-col">
      {/* ── Image ── */}
      <div className="relative overflow-hidden h-44 bg-slate-100 flex-shrink-0">
        <img
          src={vehicleImage}
          alt={vehicleName}
          className="h-full w-full object-cover image-hover"
          onError={(e) => { e.currentTarget.src = FALLBACK; }}
        />

        {/* Type badge — top left */}
        {vehicle.type && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-orange-600 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            {vehicle.type}
          </span>
        )}

        {/* Rating pill — top right */}
        <span className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
          <span className="text-yellow-400 text-xs">★</span>
          {rating}
          <span className="text-slate-400 font-normal">({reviews})</span>
        </span>

        {/* Dark gradient at bottom for text legibility */}
        <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* ── Card body ── */}
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        {/* Name + make/model/year */}
        <div>
          <h3 className="text-base font-extrabold text-slate-900 leading-tight truncate">
            {vehicleName}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {[vehicle.make || vehicle.brand, vehicle.model, vehicle.year]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400 flex-shrink-0">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span className="truncate">{vehicle.location || "Location not set"}</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100" />

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-3 mt-auto">
          <div>
            <span className="text-lg font-extrabold text-orange-600">
              ₹{(vehicle.pricePerDay || 0).toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-slate-400 font-medium"> /day</span>
          </div>

          <Link
            to={`/vehicles/${vehicle._id}`}
            className="flex-shrink-0 text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 shadow-sm hover:shadow-md transition-all"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
