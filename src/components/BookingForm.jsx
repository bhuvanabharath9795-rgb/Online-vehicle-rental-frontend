import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

export default function BookingForm({ vehicle, onBooked }) {
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    pickupLocation: vehicle?.location || "",
    dropLocation: vehicle?.location || "",
  });

  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // 1. Create booking
      const { data: booking } = await api.post("/bookings", {
        ...form,
        vehicleId: vehicle._id,
      });

      toast.success("Booking created");

      // 2. Create Razorpay order
      const { data: order } = await api.post("/payments/create-order", {
        bookingId: booking._id,
        amount: vehicle.pricePerDay * 100,
      });

      console.log("Order:", order);

      // 3. Open Razorpay
    const options = {
  key: import.meta.env.VITE_RAZORPAY_KEY,
  amount: order.amount,
  currency: order.currency,
  order_id: order.orderId,
  name: "Vehicle Rental",
  description: "Booking Payment",
  prefill: {
    name: "Test User",
    email: "test@example.com",
    contact: "9876543210",
  },
  handler: async function (response) {
    const { data: verifyData } = await api.post("/payments/verify", {
      bookingId: booking._id,
      paymentRecordId: order.paymentRecordId,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    });

    if (verifyData.success) {
      toast.success("Payment successful");
      onBooked?.(booking);
    } else {
      toast.error("Payment verification failed");
    }
  },
  
  theme: {
    color: "#3399cc",
  },
};
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submitHandler} className="space-y-3 card p-4">
      <h3 className="text-lg font-bold">Book this vehicle</h3>

      <input
        type="date"
        className="input"
        value={form.startDate}
        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        required
      />

      <input
        type="date"
        className="input"
        value={form.endDate}
        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        required
      />

      <input
        className="input"
        placeholder="Pickup location"
        value={form.pickupLocation}
        onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
      />

      <input
        className="input"
        placeholder="Drop location"
        value={form.dropLocation}
        onChange={(e) => setForm({ ...form, dropLocation: e.target.value })}
      />

      <button className="btn btn-primary w-full" disabled={loading}>
        {loading ? "Processing..." : "Book & Pay"}
      </button>
    </form>
  );
}