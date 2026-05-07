import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

export default function MyReviewsPage() {
  const [dashboard, setDashboard] = useState({
    bookings: [],
    reviews: [],
  });

  const [reviewForm, setReviewForm] = useState({
    bookingId: "",
    rating: 5,
    comment: "",
  });

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get("/users/dashboard");
      setDashboard({
        bookings: data.bookings || [],
        reviews: data.reviews || [],
      });
    } catch (error) {
      toast.error("Failed to load reviews");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const submitReview = async (e) => {
    e.preventDefault();

    try {
      await api.post("/reviews", reviewForm);

      toast.success("Review submitted for moderation");

      setReviewForm({
        bookingId: "",
        rating: 5,
        comment: "",
      });

      fetchDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Review failed");
    }
  };

  return (
    <div className="space-y-6">
      <section className="card p-4">
        <h1 className="text-2xl font-bold mb-4">My Review Submissions</h1>

        {dashboard.reviews.length === 0 ? (
          <p className="text-slate-500">No reviews submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {dashboard.reviews.map((review) => (
              <div
                key={review._id}
                className="border border-slate-200 rounded-xl p-4"
              >
                <p className="font-semibold">
                  {review.vehicle?.title || "Vehicle"}
                </p>
                <p className="text-sm">Rating: {review.rating} Star</p>
                <p className="text-sm">Comment: {review.comment}</p>
                <p className="text-sm">
                  Status: {review.status || "Pending"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card p-4">
        <h2 className="text-xl font-bold mb-4">Leave Review</h2>

        <form onSubmit={submitReview} className="grid md:grid-cols-3 gap-3">
          <select
            className="input"
            value={reviewForm.bookingId}
            onChange={(e) =>
              setReviewForm({ ...reviewForm, bookingId: e.target.value })
            }
            required
          >
            <option value="">Select Completed/Confirmed Booking</option>

            {dashboard.bookings.map((booking) => (
              <option key={booking._id} value={booking._id}>
                {booking.vehicle?.title} - {booking.bookingStatus}
              </option>
            ))}
          </select>

          <select
            className="input"
            value={reviewForm.rating}
            onChange={(e) =>
              setReviewForm({
                ...reviewForm,
                rating: Number(e.target.value),
              })
            }
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} Star
              </option>
            ))}
          </select>

          <input
            className="input"
            placeholder="Your review"
            value={reviewForm.comment}
            onChange={(e) =>
              setReviewForm({ ...reviewForm, comment: e.target.value })
            }
            required
          />

          <button className="btn btn-primary md:col-span-3">
            Submit Review
          </button>
        </form>
      </section>
    </div>
  );
}