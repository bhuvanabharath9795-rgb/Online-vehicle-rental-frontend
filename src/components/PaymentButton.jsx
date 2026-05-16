import toast from "react-hot-toast";
import api from "../services/api";

export default function PaymentButton({ booking, onSuccess }) {
  const payNow = async () => {
    try {
      const { data } = await api.post("/payments/create-order", { bookingId: booking._id });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: data.currency,
        name: "DriveNow",
        description: "Vehicle Booking Payment",
        order_id: data.orderId,
        handler: async function (response) {
          const verifyRes = await api.post("/payments/verify", {
            bookingId: booking._id,
            ...response
          });
          toast.success(verifyRes.data.message);
          onSuccess?.();
        },
        prefill: {},
        theme: { color: "#2563eb" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    }
  };

  return <button onClick={payNow} className="btn btn-primary">Pay with Razorpay</button>;
}
