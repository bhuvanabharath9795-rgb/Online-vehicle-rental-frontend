import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const STATUS_BADGE = {
  approved: "badge-success",
  pending: "badge-warning",
  rejected: "badge-danger",
};

function StarInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className={`text-3xl transition-transform hover:scale-110 leading-none ${
            n <= (hovered || value) ? "text-yellow-400" : "text-slate-200"
          }`}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-sm text-slate-500 self-center">{value} / 5</span>
    </div>
  );
}

function StarDisplay({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={`text-base ${n <= rating ? "text-yellow-400" : "text-slate-200"}`}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function MyReviewsPage() {
  const [dashboard, setDashboard] = useState({ bookings: [], reviews: [] });
  const [reviewForm, setReviewForm] = useState({ bookingId: "", rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get("/users/dashboard");
      setDashboard({ bookings: data.bookings || [], reviews: data.reviews || [] });
    } catch {
      toast.error("Failed to load reviews");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/reviews", reviewForm);
      toast.success("Review submitted for moderation");
      setReviewForm({ bookingId: "", rating: 5, comment: "" });
      fetchDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Review failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div
        className="rounded-3xl relative overflow-hidden text-white p-8 shadow-xl"
        style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)" }}
      >
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold">My Reviews</h1>
          <p className="mt-1 opacity-90 text-lg">
            {dashboard.reviews.length} review{dashboard.reviews.length !== 1 ? "s" : ""} submitted
          </p>
        </div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute right-20 bottom-4 w-24 h-24 bg-white/10 rounded-full pointer-events-none" />
      </div>

      {/* Leave a Review */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-5">Leave a Review</h2>
        <form onSubmit={submitReview} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Select Booking
            </label>
            <select
              className="input"
              value={reviewForm.bookingId}
              onChange={(e) => setReviewForm({ ...reviewForm, bookingId: e.target.value })}
              required
            >
              <option value="">Choose a booking…</option>
              {dashboard.bookings.map((booking) => (
                <option key={booking._id} value={booking._id}>
                  {booking.vehicle?.title || booking.vehicle?.model || booking.vehicle?.name || "Vehicle"} — {booking.bookingStatus}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
            <StarInput
              value={reviewForm.rating}
              onChange={(v) => setReviewForm({ ...reviewForm, rating: v })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Your Review
            </label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="Share your experience with this vehicle…"
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              required
            />
          </div>

          <button
            className="btn btn-primary w-full py-3 flex items-center justify-center gap-2"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Submitting…
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </form>
      </div>

      {/* Submitted Reviews */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Submitted Reviews</h2>

        {dashboard.reviews.length === 0 ? (
          <div className="empty-state py-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-slate-300">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <p>No reviews submitted yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {dashboard.reviews.map((review) => (
              <div
                key={review._id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-purple-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {review.vehicle?.title || "Vehicle"}
                    </p>
                    <StarDisplay rating={review.rating} />
                    <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                  <span className={STATUS_BADGE[review.status] || "badge-warning"}>
                    {review.status || "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
