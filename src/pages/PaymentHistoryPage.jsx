import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const { data } = await api.get("/users/dashboard");
      setPayments(data.payments || []);
    } catch (error) {
      toast.error("Failed to load payments");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const downloadInvoice = async (bookingId) => {
      console.log("NEW INVOICE FUNCTION RUNNING");
    try {
      const response = await api.get(`/bookings/invoice/${bookingId}`, {
        responseType: "blob",
      });

      const contentType = response.headers["content-type"];

      if (!contentType?.includes("application/pdf")) {
        const text = await response.data.text();
        toast.error(text || "Invoice download failed");
        return;
      }

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${bookingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (error.response?.data instanceof Blob) {
        const text = await error.response.data.text();
        toast.error(text || "Failed to download invoice");
      } else {
        toast.error(error.response?.data?.message || "Failed to download invoice");
      }
    }
  };

  return (
   <div className="card p-5 card-hover">
      <h1 className="text-2xl font-bold mb-4">Payment History</h1>

      <div className="space-y-3">
        {payments.map((payment) => (
          <div
  key={payment._id}
  className="card card-hover p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
>
  <div>
    <p className="font-bold text-lg">
      {payment.booking?.vehicle?.title || "Vehicle"}
    </p>

    <p className="text-sm text-slate-500">
      Invoice No: {payment.invoiceNumber}
    </p>

    <p className="text-sm text-slate-500">
      Status: {payment.status}
    </p>
  </div>

  <div className="text-left md:text-right">
    <p className="text-2xl font-extrabold text-blue-700">
      ₹{payment.amount}
    </p>

    {payment.booking?._id && payment.status === "captured" && (
      <button
        onClick={() => downloadInvoice(payment.booking._id)}
        className="btn btn-primary mt-2"
      >
        Download Invoice
      </button>
    )}
  </div>
</div>
        ))}

        {payments.length === 0 && (
          <p className="text-slate-500">No payments yet.</p>
        )}
      </div>
    </div>
  );
}