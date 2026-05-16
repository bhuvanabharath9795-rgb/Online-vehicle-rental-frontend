import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import carBg from "../assets/home-neon-car-bg.png";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { setUserInfo } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!form.email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      toast.error("Phone number must be 10 digits");
      return;
    }
    try {
      const { data } = await api.post("/auth/register", form);
      setUserInfo(data);
      toast.success("Registration successful");
      navigate("/dashboard");
    } catch (error) {
      console.log("Register error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Background with gradient overlay */}
      <div className="auth-bg-layer">
        <img src={carBg} alt="" className="auth-bg-car" />
        <div className="auth-gradient-overlay"></div>
      </div>

      {/* Left side content */}
      <div className="auth-left-panel">
        <div className="auth-welcome-content">
          <h1 className="auth-welcome-title">Sign Up</h1>
          <p className="auth-welcome-text">
            Create your account and start renting premium vehicles in minutes.
          </p>
          <div className="auth-decorative-dots">
            <span className="auth-dot"></span>
            <span className="auth-dot active"></span>
            <span className="auth-dot"></span>
          </div>
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="auth-right-panel">
        <div className="auth-form-card">
          {/* Avatar icon */}
          <div className="auth-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="36" height="36">
              <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>

          <form onSubmit={submitHandler} className="auth-form">
            {/* Full Name */}
            <div className="auth-input-group">
              <span className="auth-input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                id="register-name"
                className="auth-input"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div className="auth-input-group">
              <span className="auth-input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </span>
              <input
                id="register-email"
                className="auth-input"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            {/* Password */}
            <div className="auth-input-group">
              <span className="auth-input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="register-password"
                className="auth-input"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="auth-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>

            {/* Phone */}
            <div className="auth-input-group">
              <span className="auth-input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </span>
              <input
                id="register-phone"
                className="auth-input"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            {/* Address */}
            <div className="auth-input-group">
              <span className="auth-input-icon" style={{ alignSelf: "flex-start", marginTop: "14px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </span>
              <textarea
                id="register-address"
                className="auth-input auth-textarea"
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows="2"
              ></textarea>
            </div>

            {/* Register button */}
            <button id="register-submit" type="submit" className="auth-submit-btn">
              REGISTER
            </button>
          </form>

          {/* Footer link */}
          <p className="auth-footer-text">
            Already have an account?{" "}
            <Link to="/login" className="auth-footer-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
