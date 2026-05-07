import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

export default function DashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reviews, setReviews] = useState([]);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get("/users/dashboard");
      setBookings(data.bookings || []);
      setPayments(data.payments || []);
      setReviews(data.reviews || []);
    } catch {
      toast.error("Failed to load dashboard");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white p-6 shadow-lg">
  <h1 className="text-4xl font-extrabold">My Dashboard</h1>
<p className="mt-1 opacity-90">View your bookings, payments and reviews</p>
</div>

     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6 card-hover">
          <p className="text-sm text-slate-500">Total Bookings</p>
          <h2 className="text-4xl font-extrabold text-blue-700">
            {bookings.length}
          </h2>
        </div>

        <div className="card p-6 card-hover">
          <p className="text-sm text-slate-500">Payments</p>
          <h2 className="text-4xl font-extrabold text-green-600">
            {payments.length}
          </h2>
        </div>

        <div className="card p-6 card-hover">
          <p className="text-sm text-slate-500">Reviews</p>
          <h2 className="text-4xl font-extrabold text-purple-600">
            {reviews.length}
          </h2>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>

        {bookings.length === 0 ? (
          <p className="text-slate-500">No bookings yet.</p>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking._id}
                className="flex justify-between border-b pb-3"
              >
                <div>
                  <p className="font-semibold">
                    {booking.vehicle?.title ||
                      booking.vehicle?.model ||
                      "Vehicle"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {new Date(booking.startDate).toLocaleDateString()} -{" "}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-blue-700">
                    ₹{booking.totalAmount}
                  </p>
                  <p className="text-sm text-slate-500">
                    {booking.bookingStatus}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}