import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import VehicleCard from "../components/VehicleCard";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [filters, setFilters] = useState({
    keyword: "",
    type: "",
    location: "",
    minPrice: "",
    maxPrice: "",
  });
const fetchVehicles = async () => {
  try {
    setLoading(true);
    const params = {};

    Object.keys(filters).forEach((key) => {
      if (filters[key] !== "") params[key] = filters[key];
    });

    const query = new URLSearchParams(params).toString();
    const { data } = await api.get(query ? `/vehicles?${query}` : "/vehicles");

    setVehicles(Array.isArray(data) ? data : data.vehicles || []);
  } catch (error) {
    toast.error("Failed to load vehicles");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchVehicles();
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    fetchVehicles();
  };

  return (
  <div className="space-y-6 px-2 md:px-0">
     <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-500 text-white p-8 md:p-12 shadow-xl">
  <div className="relative z-10">
    <h1 className="text-4xl md:text-5xl font-extrabold">
      Find your perfect ride
    </h1>
    <p className="mt-3 text-lg opacity-90">
      Book cars, bikes, vans and trucks instantly.
    </p>
  </div>

  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/20" />
  <div className="absolute right-20 bottom-6 h-24 w-24 rounded-full bg-white/10" />
</section>

      <form
        onSubmit={submitHandler}
        className="card p-5 grid md:grid-cols-5 gap-3 shadow-lg"
      >
        <input
          className="input"
          placeholder="Search make/model"
          value={filters.keyword}
          onChange={(e) =>
            setFilters({ ...filters, keyword: e.target.value })
          }
        />

        <select
          className="input"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="Car">Car</option>
          <option value="Bike">Bike</option>
          <option value="Scooter">Scooter</option>
          <option value="SUV">SUV</option>
          <option value="Van">Van</option>
          <option value="Truck">Truck</option>
        </select>

        <input
          className="input"
          placeholder="Location"
          value={filters.location}
          onChange={(e) =>
            setFilters({ ...filters, location: e.target.value })
          }
        />

        <input
          className="input"
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) =>
            setFilters({ ...filters, minPrice: e.target.value })
          }
        />

        <input
          className="input"
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters({ ...filters, maxPrice: e.target.value })
          }
        />

        <button className="btn btn-primary md:col-span-5">
          Search Vehicles
        </button>
      </form>

      {/* Loading message */}
{loading && (
  <p className="text-center text-slate-500 col-span-3">
    Loading vehicles...
  </p>
)}

{/* Vehicle list */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {!loading && vehicles.length === 0 && (
    <p className="text-center col-span-3 text-slate-500">
      No vehicles found
    </p>
  )}

  {vehicles.map((vehicle) => (
    <VehicleCard key={vehicle._id} vehicle={vehicle} />
  ))}
</div>
    </div>
  );
}