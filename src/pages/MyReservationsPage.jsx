import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../services/api";
import PaymentButton from "../components/PaymentButton";

export default function MyReservationsPage() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings/my");
      setBookings(data);
    } catch (error) {
      toast.error("Failed to load bookings");
    }
  };

  const activeBookings = bookings.filter(
  (b) => b.bookingStatus === "confirmed"
);

const cancelledBookings = bookings.filter(
  (b) => b.bookingStatus === "cancelled"
);

const completedBookings = bookings.filter(
  (b) => b.bookingStatus === "completed"
);

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    try {
      await api.patch(`/bookings/${id}/cancel`);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  };
 

  return (
    <div className="card p-4">
      <h2 className="section-title">Active Reservations</h2>
<h2 className="section-title">Completed Reservations</h2>
<h2 className="section-title">Cancelled Reservations</h2>

      {bookings?.map((booking) => (
        <div
  key={booking._id}
  className="card p-5 mb-4 card-hover"
>
  <div className="flex justify-between gap-4">
    <div>
      <h2 className="text-xl font-bold text-slate-900">
        {booking.vehicle?.title || booking.vehicle?.model || "Vehicle"}
      </h2>

      <p className="text-sm text-slate-500 mt-1">
        {new Date(booking.startDate).toLocaleDateString()} →{" "}
        {new Date(booking.endDate).toLocaleDateString()}
      </p>
    </div>

    <div className="text-right">
      <p className="text-lg font-bold text-blue-700">
        ₹{booking.totalAmount}
      </p>
      <p className="text-xs text-slate-500">Total Amount</p>
    </div>
  </div>

  <div className="flex gap-2 mt-4">
    <span
      className={
        booking.bookingStatus === "cancelled"
          ? "badge-danger"
          : "badge-success"
      }
    >
      {booking.bookingStatus}
    </span>

    <span
      className={
        booking.paymentStatus === "paid"
          ? "badge-success"
          : "badge-warning"
      }
    >
      {booking.paymentStatus}
    </span>
  </div>

  <div className="flex gap-3 mt-5">
    {booking.paymentStatus !== "paid" &&
      booking.bookingStatus !== "cancelled" && (
        <PaymentButton booking={booking} onSuccess={fetchBookings} />
      )}

    {booking.bookingStatus !== "cancelled" && (
      <button
        onClick={() => cancelBooking(booking._id)}
        className="btn btn-danger"
      >
        Cancel
      </button>
    )}
  </div>
</div>
      ))}

      {bookings?.length === 0 && <p>No bookings yet.</p>}
    </div>
  );
}