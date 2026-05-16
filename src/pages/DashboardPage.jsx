import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

const STATUS_STYLE = {
  confirmed: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  completed: { bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-500" },
  cancelled: { bg: "bg-red-100",     text: "text-red-700",     dot: "bg-red-500" },
  pending:   { bg: "bg-yellow-100",  text: "text-yellow-700",  dot: "bg-yellow-500" },
};

function StatusChip({ status }) {
  const s = STATUS_STYLE[status] || { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{status}
    </span>
  );
}

function StatCard({ label, value, sub, icon, gradient, onClick }) {
  return (
    <div onClick={onClick} className={`rounded-2xl p-5 text-white relative overflow-hidden shadow-md ${onClick ? "cursor-pointer hover:scale-[1.02] transition-transform" : ""}`}
      style={{ background: gradient }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/70 text-xs font-semibold uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-extrabold mt-1.5 tracking-tight">{value}</p>
          {sub && <p className="text-white/60 text-xs mt-1">{sub}</p>}
        </div>
        <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">{icon}</div>
      </div>
      <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-white/10 rounded-full pointer-events-none" />
    </div>
  );
}

const QuickLink = ({ to, icon, label, desc, color }) => {
  const nav = useNavigate();
  return (
    <button onClick={() => nav(to)}
      className="card card-hover p-4 flex items-center gap-4 text-left w-full">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>{icon}</div>
      <div>
        <p className="font-bold text-slate-800 text-sm">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto text-slate-300"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
  );
};

export default function DashboardPage() {
  const [bookings, setBookings]   = useState([]);
  const [payments, setPayments]   = useState([]);
  const [reviews,  setReviews]    = useState([]);
  const [loading,  setLoading]    = useState(true);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/users/dashboard");
        setBookings(data.bookings || []);
        setPayments(data.payments || []);
        setReviews(data.reviews  || []);
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalSpent  = payments.filter((p) => p.status === "captured").reduce((s, p) => s + (p.amount || 0), 0);
  const activeCount = bookings.filter((b) => ["confirmed", "pending"].includes(b.bookingStatus)).length;

  if (loading) return (
    <div className="space-y-6">
      <div className="rounded-3xl h-44 animate-pulse" style={{ background: "linear-gradient(135deg,#431407,#c2410c)" }} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="rounded-2xl h-24 bg-slate-100 animate-pulse" />)}
      </div>
    </div>
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">

      {/* ── HERO ── */}
      <div className="rounded-3xl relative overflow-hidden text-white shadow-xl"
        style={{ background: "linear-gradient(135deg,#1c0800 0%,#431407 35%,#7c2d00 65%,#c2410c 100%)" }}>
        <div className="relative z-10 p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-white/60 text-sm font-medium">{greeting},</p>
              <h1 className="text-4xl font-extrabold tracking-tight mt-0.5">
                {userInfo.name || "Welcome back"}!
              </h1>
              <p className="mt-2 text-white/65 text-base">
                Here's an overview of your rental activity.
              </p>
            </div>
            {activeCount > 0 && (
              <div className="bg-white/12 backdrop-blur-sm rounded-2xl px-5 py-3.5 border border-white/15 text-center">
                <p className="text-3xl font-extrabold">{activeCount}</p>
                <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mt-0.5">Active Bookings</p>
              </div>
            )}
          </div>
        </div>
        <div className="absolute -right-12 -top-12 w-56 h-56 bg-white/6 rounded-full pointer-events-none" />
        <div className="absolute right-24 bottom-0 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -left-6 bottom-0 w-28 h-28 bg-orange-300/5 rounded-full pointer-events-none" />
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Bookings" value={bookings.length}
          sub={`${activeCount} active`}
          gradient="linear-gradient(135deg,#c2410c,#f97316)"
          onClick={() => navigate("/my-reservations")}
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
        />
        <StatCard
          label="Payments Made" value={payments.length}
          sub={`${payments.filter(p=>p.status==="captured").length} successful`}
          gradient="linear-gradient(135deg,#059669,#10b981)"
          onClick={() => navigate("/payment-history")}
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}
        />
        <StatCard
          label="Reviews Given" value={reviews.length}
          sub="Ratings shared"
          gradient="linear-gradient(135deg,#7c3aed,#a78bfa)"
          onClick={() => navigate("/my-reviews")}
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
        />
        <StatCard
          label="Total Spent" value={`₹${totalSpent.toLocaleString("en-IN")}`}
          sub="Across all bookings"
          gradient="linear-gradient(135deg,#1d4ed8,#3b82f6)"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── RECENT BOOKINGS ── */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-5 rounded-full bg-orange-500" />
              Recent Bookings
            </h2>
            <button onClick={() => navigate("/my-reservations")}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700">View all →</button>
          </div>

          {bookings.length === 0 ? (
            <div className="py-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-300"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <p className="font-semibold text-slate-600">No bookings yet</p>
              <p className="text-sm text-slate-400 mt-1">Start exploring vehicles to make your first booking!</p>
              <button onClick={() => navigate("/")} className="mt-3 btn btn-primary text-sm px-4 py-2">Browse Vehicles</button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking._id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="16" r="1"/><circle cx="20" cy="16" r="1"/></svg>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{booking.vehicle?.title || booking.vehicle?.model || "Vehicle"}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(booking.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        {" – "}
                        {new Date(booking.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <p className="font-extrabold text-orange-600 text-sm">₹{booking.totalAmount?.toLocaleString("en-IN")}</p>
                    <StatusChip status={booking.bookingStatus} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── QUICK LINKS + RECENT PAYMENTS ── */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Quick Links</h2>
            <div className="space-y-2">
              <QuickLink to="/my-reservations" label="My Reservations" desc="View & manage bookings" color="bg-orange-50 text-orange-600"
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
              />
              <QuickLink to="/payment-history" label="Payment History" desc="Invoices & transactions" color="bg-green-50 text-green-600"
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}
              />
              <QuickLink to="/my-reviews" label="My Reviews" desc="Ratings & feedback" color="bg-purple-50 text-purple-600"
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
              />
              <QuickLink to="/" label="Browse Vehicles" desc="Find your next ride" color="bg-blue-50 text-blue-600"
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>}
              />
            </div>
          </div>

          {payments.length > 0 && (
            <div className="card p-5">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Recent Payments</h2>
              <div className="space-y-2.5">
                {payments.slice(0, 3).map((p) => (
                  <div key={p._id} className="flex items-center justify-between text-sm">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{p.booking?.vehicle?.title || "Vehicle"}</p>
                      <p className="text-xs text-slate-400">{p.createdAt && new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                    </div>
                    <span className="font-bold text-emerald-600 flex-shrink-0 ml-2">₹{p.amount?.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate("/payment-history")} className="mt-3 text-xs font-semibold text-orange-600 hover:text-orange-700 block">View all payments →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
