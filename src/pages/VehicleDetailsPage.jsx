import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import BookingForm from "../components/BookingForm";
import ReviewList from "../components/ReviewList";
import MaintenanceList from "../components/MaintenanceList";
import { useAuth } from "../context/AuthContext";
export default function VehicleDetailsPage() {
  const { id } = useParams();
  const { userInfo } = useAuth();
  const [data, setData] = useState({
    vehicle: null,
    reviews: [],
    maintenanceRecords: [],
  });

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/vehicles/${id}`);
      console.log("Vehicle:", res.data); // DEBUG
      setData(res.data);
    } catch (error) {
      toast.error("Failed to load vehicle");
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (!data.vehicle) return <p>Loading...</p>;

  const { vehicle, reviews, maintenanceRecords } = data;

  const make = vehicle.make || vehicle.brand || "";
const model = vehicle.model || "";
const title = vehicle.title || `${make} ${model}`.trim();

const vehicleImage =
  vehicle.image ||
  (Array.isArray(vehicle.images) ? vehicle.images[0] : vehicle.images) ||
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop";
  console.log(vehicle);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="card overflow-hidden">
       <img
             src={vehicleImage}
             alt={title}
             className="w-full h-80 object-cover"
             onError={(e) => {
             e.currentTarget.src ="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop";
            }}
      />

          <div className="p-6 space-y-3">
            <h1 className="text-3xl font-bold">{title}</h1>

            <p>{vehicle.description || "No description available"}</p>

            <div className="grid md:grid-cols-3 gap-3 text-sm">
              <p><b>Make:</b> {make || "N/A"}</p>
              <p><b>Model:</b> {model || "N/A"}</p>
              <p><b>Year:</b> {vehicle.year || "N/A"}</p>
              <p><b>Type:</b> {vehicle.type || "N/A"}</p>
              <p><b>Location:</b> {vehicle.location || "N/A"}</p>
              <p><b>Price:</b> ₹{vehicle.pricePerDay || 0}/day</p>
              <p><b>Fuel:</b> {vehicle.fuelType || "N/A"}</p>
              <p><b>Transmission:</b> {vehicle.transmission || "N/A"}</p>
              <p><b>Seats:</b> {vehicle.seats || "N/A"}</p>
            </div>
          </div>
        </div>

        <MaintenanceList records={maintenanceRecords} />
        <ReviewList reviews={reviews} />
      </div>

      <div>
        {userInfo ? (
          <BookingForm vehicle={vehicle} />
        ) : (
          <div className="card p-4">
            <p className="text-slate-600">Login to book this vehicle.</p>
          </div>
        )}
      </div>
    </div>
  );
}
