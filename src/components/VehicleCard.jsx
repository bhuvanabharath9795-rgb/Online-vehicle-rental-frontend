import { Link } from "react-router-dom";

export default function VehicleCard({ vehicle }) {
  const vehicleName =
    vehicle.title ||
    vehicle.name ||
    `${vehicle.make || vehicle.brand || ""} ${vehicle.model || ""}`.trim() ||
    "Vehicle";

  const vehicleImage =
    vehicle.image ||
    (Array.isArray(vehicle.images) ? vehicle.images[0] : vehicle.images) ||
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="group card overflow-hidden card-hover">
      <div className="overflow-hidden">
        <img
          src={vehicleImage}
          alt={vehicleName}
          className="h-56 w-full object-cover image-hover"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop";
          }}
        />
      </div>

      <div className="p-5 space-y-3">
        <div className="flex justify-between gap-3">
          <h3 className="text-xl font-extrabold text-slate-900">
            {vehicleName}
          </h3>

          <span className="badge bg-blue-100 text-blue-700">
            {vehicle.type || "Vehicle"}
          </span>
        </div>

        <p className="text-sm text-slate-500">
          {vehicle.make || vehicle.brand || "Brand"} • {vehicle.model || "Model"} •{" "}
          {vehicle.year || "Year"}
        </p>

        <p className="text-sm text-slate-600">
          📍 {vehicle.location || "Location"}
        </p>

        <div className="flex justify-between items-center pt-2">
          <p className="text-xl font-extrabold text-blue-700">
            ₹{vehicle.pricePerDay || 0}
            <span className="text-sm font-medium text-slate-500">/day</span>
          </p>

          <p className="text-sm">
            ⭐ {vehicle.averageRating?.toFixed?.(1) || 0} (
            {vehicle.totalReviews || 0})
          </p>
        </div>

        <Link
          to={`/vehicles/${vehicle._id}`}
          className="btn btn-primary block text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}