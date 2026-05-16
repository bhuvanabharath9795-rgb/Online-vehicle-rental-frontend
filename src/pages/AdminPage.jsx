import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const TABS = ["Overview", "Vehicles", "Bookings", "Reviews", "Maintenance"];

const TAB_ICONS = {
  Overview:    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Vehicles:    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="16" r="1"/><circle cx="20" cy="16" r="1"/></svg>,
  Bookings:    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Reviews:     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Maintenance: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
};

function StatCard({ label, value, sub, icon, gradient, badge }) {
  return (
    <div className="rounded-2xl p-5 text-white relative overflow-hidden shadow-lg" style={{ background: gradient }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/70 text-sm font-medium">{label}</p>
          <p className="text-3xl font-extrabold mt-1 tracking-tight">{value}</p>
          {sub && <p className="text-white/60 text-xs mt-1">{sub}</p>}
        </div>
        <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">{icon}</div>
      </div>
      {badge && (
        <div className="mt-3 inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 text-xs font-semibold">
          <div className="w-1.5 h-1.5 rounded-full bg-white" />{badge}
        </div>
      )}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full pointer-events-none" />
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    confirmed:  "bg-emerald-100 text-emerald-700",
    completed:  "bg-blue-100 text-blue-700",
    cancelled:  "bg-red-100 text-red-700",
    pending:    "bg-yellow-100 text-yellow-700",
    approved:   "bg-emerald-100 text-emerald-700",
    rejected:   "bg-red-100 text-red-700",
    captured:   "bg-emerald-100 text-emerald-700",
    paid:       "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status] || "bg-slate-100 text-slate-600"}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />{status}
    </span>
  );
}

export default function AdminPage() {
  const [data, setData]   = useState(null);
  const [tab, setTab]     = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [maintenance, setMaintenance] = useState({
    vehicle: "", title: "", details: "", serviceDate: "", cost: "", nextServiceDate: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/dashboard");
      setData(res.data);
    } catch {
      toast.error("Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updateVehicleStatus = async (id, status) => {
    try {
      await api.patch(`/admin/vehicles/${id}/status`, { status });
      toast.success(`Vehicle ${status}`);
      fetchData();
    } catch { toast.error("Action failed"); }
  };

  const moderateReview = async (id, status) => {
    try {
      await api.patch(`/reviews/${id}/moderate`, { status });
      toast.success(`Review ${status}`);
      fetchData();
    } catch { toast.error("Action failed"); }
  };

  const completeBooking = async (id) => {
    try {
      await api.patch(`/admin/bookings/${id}/complete`);
      toast.success("Booking marked complete");
      fetchData();
    } catch { toast.error("Action failed"); }
  };

  const addMaintenance = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/maintenance", maintenance);
      toast.success("Maintenance record added");
      setMaintenance({ vehicle: "", title: "", details: "", serviceDate: "", cost: "", nextServiceDate: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add record");
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="rounded-3xl h-36 animate-pulse" style={{ background: "linear-gradient(135deg,#312e81,#4f46e5,#7c3aed)" }} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="rounded-2xl h-28 bg-slate-100 animate-pulse" />)}
      </div>
    </div>
  );

  const stats = data?.stats || {};
  const revenue = typeof stats.revenue === "number"
    ? `₹${stats.revenue.toLocaleString("en-IN")}`
    : `₹${(stats.revenue || 0)}`;

  const pendingVehicleCount = data?.pendingVehicles?.length || 0;
  const pendingReviewCount  = data?.pendingReviews?.length  || 0;

  return (
    <div className="space-y-6">

      {/* ── HERO ── */}
      <div className="rounded-3xl relative overflow-hidden text-white p-8 shadow-xl"
        style={{ background: "linear-gradient(135deg,#312e81 0%,#4f46e5 45%,#7c3aed 100%)" }}>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Admin Panel</p>
            <h1 className="text-4xl font-extrabold tracking-tight">Admin Dashboard</h1>
            <p className="mt-2 text-white/70 text-base">Manage vehicles, bookings and platform activity.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {pendingVehicleCount > 0 && (
              <div className="bg-yellow-400/20 border border-yellow-400/30 rounded-xl px-4 py-2 text-center">
                <p className="text-2xl font-extrabold text-yellow-300">{pendingVehicleCount}</p>
                <p className="text-yellow-200 text-xs font-medium">Vehicles Pending</p>
              </div>
            )}
            {pendingReviewCount > 0 && (
              <div className="bg-orange-400/20 border border-orange-400/30 rounded-xl px-4 py-2 text-center">
                <p className="text-2xl font-extrabold text-orange-300">{pendingReviewCount}</p>
                <p className="text-orange-200 text-xs font-medium">Reviews Pending</p>
              </div>
            )}
          </div>
        </div>
        <div className="absolute -right-12 -top-12 w-56 h-56 bg-white/6 rounded-full pointer-events-none" />
        <div className="absolute right-24 bottom-0 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users"    value={stats.usersCount    || 0} gradient="linear-gradient(135deg,#1d4ed8,#3b82f6)" badge="Registered" icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} />
        <StatCard label="Total Vehicles" value={stats.vehiclesCount || 0} gradient="linear-gradient(135deg,#059669,#34d399)" badge="Listed" icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="16" r="1"/><circle cx="20" cy="16" r="1"/></svg>} />
        <StatCard label="Total Bookings" value={stats.bookingsCount || 0} gradient="linear-gradient(135deg,#7c3aed,#a78bfa)" badge="All time" icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>} />
        <StatCard label="Total Revenue"  value={revenue}            gradient="linear-gradient(135deg,#d97706,#f59e0b)" badge="Collected" icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-1 justify-center ${
              tab === t
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {TAB_ICONS[t]}
            {t}
            {t === "Vehicles" && pendingVehicleCount > 0 && (
              <span className="bg-yellow-400 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{pendingVehicleCount}</span>
            )}
            {t === "Reviews" && pendingReviewCount > 0 && (
              <span className="bg-orange-400 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{pendingReviewCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {tab === "Overview" && (
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-5 border-l-4 border-yellow-400">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1">Pending Approvals</p>
              <p className="text-3xl font-extrabold text-yellow-600">{pendingVehicleCount}</p>
              <p className="text-sm text-slate-500 mt-1">Vehicle listings awaiting review</p>
              <button onClick={() => setTab("Vehicles")} className="mt-3 text-xs font-semibold text-indigo-600 hover:underline">Review now →</button>
            </div>
            <div className="card p-5 border-l-4 border-orange-400">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1">Pending Reviews</p>
              <p className="text-3xl font-extrabold text-orange-600">{pendingReviewCount}</p>
              <p className="text-sm text-slate-500 mt-1">User reviews awaiting moderation</p>
              <button onClick={() => setTab("Reviews")} className="mt-3 text-xs font-semibold text-indigo-600 hover:underline">Moderate now →</button>
            </div>
            <div className="card p-5 border-l-4 border-blue-400">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1">Recent Bookings</p>
              <p className="text-3xl font-extrabold text-blue-600">{data?.recentBookings?.length || 0}</p>
              <p className="text-sm text-slate-500 mt-1">Latest booking activity</p>
              <button onClick={() => setTab("Bookings")} className="mt-3 text-xs font-semibold text-indigo-600 hover:underline">View all →</button>
            </div>
          </div>

          {/* Recent booking list */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-5 rounded-full bg-indigo-500" />
              Recent Booking Activity
            </h2>
            {!data?.recentBookings?.length ? (
              <p className="text-slate-400 text-sm py-6 text-center">No bookings yet</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {data.recentBookings.slice(0, 5).map((item) => (
                  <div key={item._id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        {TAB_ICONS.Vehicles}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{item.vehicle?.title || item.vehicle?.model || "Vehicle"}</p>
                        <p className="text-xs text-slate-400">{item.user?.name || "User"} · {item.user?.email || ""}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusPill status={item.bookingStatus} />
                      <p className="font-bold text-slate-800 text-sm">₹{item.totalAmount?.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── VEHICLES TAB ── */}
      {tab === "Vehicles" && (
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-5 rounded-full bg-yellow-400" />
            Pending Vehicle Approvals
            {pendingVehicleCount > 0 && <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">{pendingVehicleCount} pending</span>}
          </h2>

          {!data?.pendingVehicles?.length ? (
            <div className="py-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="font-semibold text-slate-700">All caught up!</p>
              <p className="text-sm text-slate-400 mt-1">No pending vehicle approvals</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.pendingVehicles.map((item) => (
                <div key={item._id} className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 hover:bg-yellow-50 rounded-2xl transition-colors border border-slate-100">
                  <div className="flex items-center gap-4">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={item.title} className="w-16 h-12 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-12 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0">
                        {TAB_ICONS.Vehicles}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-slate-900">{item.title || `${item.make || ""} ${item.model || ""}`}</p>
                      <p className="text-sm text-slate-500 mt-0.5">
                        <span className="capitalize">{item.type}</span> · {item.location} · <span className="font-semibold text-slate-700">₹{item.pricePerDay}/day</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateVehicleStatus(item._id, "approved")}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Approve
                    </button>
                    <button onClick={() => updateVehicleStatus(item._id, "rejected")}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── BOOKINGS TAB ── */}
      {tab === "Bookings" && (
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-5 rounded-full bg-blue-500" />
            All Recent Bookings
          </h2>

          {!data?.recentBookings?.length ? (
            <p className="text-slate-400 text-sm py-8 text-center">No bookings found</p>
          ) : (
            <div className="space-y-3">
              {data.recentBookings.map((item) => (
                <div key={item._id} className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl transition-colors border border-slate-100">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                      {TAB_ICONS.Bookings}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{item.vehicle?.title || item.vehicle?.model || "Vehicle"}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.user?.name || "User"} ·{" "}
                        {item.startDate && new Date(item.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        {" → "}
                        {item.endDate && new Date(item.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <StatusPill status={item.bookingStatus} />
                    <StatusPill status={item.paymentStatus} />
                    <p className="font-bold text-slate-800">₹{item.totalAmount?.toLocaleString("en-IN")}</p>
                    {item.bookingStatus !== "completed" && item.bookingStatus !== "cancelled" && (
                      <button onClick={() => completeBooking(item._id)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors">
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── REVIEWS TAB ── */}
      {tab === "Reviews" && (
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-5 rounded-full bg-orange-400" />
            Pending Review Moderation
            {pendingReviewCount > 0 && <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">{pendingReviewCount} pending</span>}
          </h2>

          {!data?.pendingReviews?.length ? (
            <div className="py-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="font-semibold text-slate-700">All caught up!</p>
              <p className="text-sm text-slate-400 mt-1">No reviews pending moderation</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.pendingReviews.map((item) => (
                <div key={item._id} className="p-4 bg-slate-50 hover:bg-orange-50 rounded-2xl transition-colors border border-slate-100 space-y-3">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-bold text-slate-900">{item.vehicle?.title || item.vehicle?.model || "Vehicle"}</p>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={i < item.rating ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 italic">"{item.comment}"</p>
                      <p className="text-xs text-slate-400 mt-1">By {item.user?.name || "User"} · {item.user?.email || ""}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => moderateReview(item._id, "approved")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        Approve
                      </button>
                      <button onClick={() => moderateReview(item._id, "rejected")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MAINTENANCE TAB ── */}
      {tab === "Maintenance" && (
        <div className="card p-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
            <span className="w-2 h-5 rounded-full bg-indigo-500" />
            Add Maintenance Record
          </h2>

          <form onSubmit={addMaintenance} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Vehicle ID *</label>
                <input className="input w-full" placeholder="Enter vehicle ID" value={maintenance.vehicle}
                  onChange={(e) => setMaintenance({ ...maintenance, vehicle: e.target.value })} required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Title *</label>
                <input className="input w-full" placeholder="e.g. Oil Change, Tyre Rotation" value={maintenance.title}
                  onChange={(e) => setMaintenance({ ...maintenance, title: e.target.value })} required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Details *</label>
                <textarea className="input w-full min-h-[80px] resize-none" placeholder="Describe the maintenance work done..."
                  value={maintenance.details} onChange={(e) => setMaintenance({ ...maintenance, details: e.target.value })} required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Service Date *</label>
                <input className="input w-full" type="date" value={maintenance.serviceDate}
                  onChange={(e) => setMaintenance({ ...maintenance, serviceDate: e.target.value })} required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Cost (₹)</label>
                <input className="input w-full" placeholder="e.g. 2500" type="number" value={maintenance.cost}
                  onChange={(e) => setMaintenance({ ...maintenance, cost: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Next Service Date</label>
                <input className="input w-full" type="date" value={maintenance.nextServiceDate}
                  onChange={(e) => setMaintenance({ ...maintenance, nextServiceDate: e.target.value })} />
              </div>
            </div>

            <button type="submit" disabled={saving}
              className="w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
              style={{ background: saving ? "#6366f1aa" : "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
              {saving ? (
                <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</>
              ) : (
                <><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>Save Maintenance Record</>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
