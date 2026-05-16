import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import PaymentButton from "../components/PaymentButton";

const TABS = [
  { key: "confirmed", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const BOOKING_STATUS_STYLE = {
  confirmed: "badge-success",
  completed: "badge-info",
  cancelled: "badge-danger",
  pending: "badge-warning",
};

const PAYMENT_STATUS_STYLE = {
  paid: "badge-success",
  pending: "badge-warning",
  failed: "badge-danger",
};

export default function MyReservationsPage() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState("confirmed");
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings/my");
      setBookings(data);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    try {
      await api.patch(`/bookings/${id}/cancel`);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel");
    }
  };

  const counts = {
    confirmed: bookings.filter((b) => ["confirmed", "pending"].includes(b.bookingStatus)).length,
    completed: bookings.filter((b) => b.bookingStatus === "completed").length,
    cancelled: bookings.filter((b) => b.bookingStatus === "cancelled").length,
  };

  const shownBookings = bookings.filter((b) =>
    tab === "confirmed"
      ? ["confirmed", "pending"].includes(b.bookingStatus)
      : b.bookingStatus === tab
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl h-28 bg-gradient-to-r from-orange-800 to-orange-400 animate-pulse" />
        <div className="flex gap-1.5 bg-slate-100 rounded-2xl p-1.5">
          {[1, 2, 3].map((i) => <div key={i} className="flex-1 h-10 bg-white rounded-xl animate-pulse" />)}
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="card p-5 space-y-3 animate-pulse">
            <div className="flex justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-slate-100 rounded w-1/2" />
                <div className="h-3 bg-slate-100 rounded w-1/3" />
              </div>
              <div className="h-6 bg-slate-100 rounded w-20" />
            </div>
            <div className="flex gap-2">
              <div className="h-5 bg-slate-100 rounded w-20" />
              <div className="h-5 bg-slate-100 rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div
        className="rounded-3xl relative overflow-hidden text-white p-8 shadow-xl"
        style={{ background: "linear-gradient(135deg, #e65100 0%, #f57c00 40%, #ff9800 80%, #ffb74d 100%)" }}
      >
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold">My Reservations</h1>
          <p className="mt-1 opacity-90 text-lg">
            {bookings.length} total booking{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute right-20 bottom-4 w-24 h-24 bg-white/10 rounded-full pointer-events-none" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-slate-100 rounded-2xl p-1.5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              tab === t.key
                ? "bg-white shadow text-orange-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
            {counts[t.key] > 0 && (
              <span
                className={`ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  tab === t.key
                    ? "bg-orange-100 text-orange-600"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {counts[t.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Booking Cards */}
      <div className="space-y-4">
        {shownBookings.length === 0 ? (
          <div className="empty-state py-14">
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-slate-300">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <p className="font-medium">
              No {tab === "confirmed" ? "active" : tab} reservations.
            </p>
          </div>
        ) : (
          shownBookings.map((booking) => (
            <div key={booking._id} className="card card-hover p-5">
              <div className="flex justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {booking.vehicle?.title || booking.vehicle?.model || "Vehicle"}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {new Date(booking.startDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {" → "}
                    {new Date(booking.endDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-extrabold text-orange-600">
                    ₹{booking.totalAmount?.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">Total Amount</p>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <span className={BOOKING_STATUS_STYLE[booking.bookingStatus] || "badge-warning"}>
                  {booking.bookingStatus}
                </span>
                <span className={PAYMENT_STATUS_STYLE[booking.paymentStatus] || "badge-warning"}>
                  {booking.paymentStatus}
                </span>
              </div>

              {(booking.paymentStatus !== "paid" || booking.bookingStatus !== "cancelled") && (
                <div className="flex gap-3 mt-4">
                  {booking.paymentStatus !== "paid" && booking.bookingStatus !== "cancelled" && (
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
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
