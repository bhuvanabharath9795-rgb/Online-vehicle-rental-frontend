import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ isOpen, onClose, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { setUserInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setShowPassword(false);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", loginForm);
      setUserInfo(data);
      toast.success("Login successful");
      onClose();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerForm.name.trim()) { toast.error("Name is required"); return; }
    if (!registerForm.email.includes("@")) { toast.error("Enter a valid email"); return; }
    if (registerForm.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (!/^[0-9]{10}$/.test(registerForm.phone)) { toast.error("Phone number must be 10 digits"); return; }
    try {
      const { data } = await api.post("/auth/register", registerForm);
      setUserInfo(data);
      toast.success("Registration successful");
      onClose();
      navigate("/dashboard");
    } catch (error) {
      console.log("Register error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setShowPassword(false);
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="auth-modal-close" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Left decorative panel */}
        <div className="auth-modal-left">
          <div className="auth-modal-left-content">
            <h2 className="auth-modal-left-title">
              {mode === "login" ? "Welcome Back!" : "Join Us!"}
            </h2>
            <p className="auth-modal-left-text">
              {mode === "login"
                ? "Sign in to access your reservations, reviews, and exclusive deals."
                : "Create your account and start renting premium vehicles in minutes."}
            </p>
            <div className="auth-modal-left-dots">
              <span className={`auth-modal-dot ${mode === "login" ? "active" : ""}`}></span>
              <span className={`auth-modal-dot ${mode === "register" ? "active" : ""}`}></span>
            </div>
          </div>
          {/* Decorative car silhouette */}
          <div className="auth-modal-car-silhouette">
            <svg viewBox="0 0 640 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M45 160 C45 160 80 160 120 160 L140 100 C140 100 180 50 250 50 L390 50 C420 50 460 70 480 100 L520 160 C560 160 595 160 595 160" stroke="rgba(255,255,255,0.25)" strokeWidth="3" fill="none"/>
              <circle cx="155" cy="165" r="25" stroke="rgba(255,255,255,0.25)" strokeWidth="3" fill="none"/>
              <circle cx="485" cy="165" r="25" stroke="rgba(255,255,255,0.25)" strokeWidth="3" fill="none"/>
            </svg>
          </div>
        </div>

        {/* Right form panel */}
        <div className="auth-modal-right">
          {/* Heading instead of tabs */}
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {mode === "login"
                ? "Sign in to manage your bookings and reviews."
                : "Join DriveNow and start booking in minutes."}
            </p>
          </div>

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="auth-modal-form">
              <div className="auth-modal-input-group">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="auth-modal-input-group">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
                <button type="button" className="auth-modal-eye" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              <button type="submit" className="auth-modal-submit">LOGIN</button>
              <p className="auth-modal-switch-text">
                Don't have an account?{" "}
                <button type="button" onClick={() => switchMode("register")} className="auth-modal-switch-link">Register</button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-modal-form">
              <div className="auth-modal-input-group">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input
                  placeholder="Full Name"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="auth-modal-input-group">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="auth-modal-input-group">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (min 6 chars)"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  required
                />
                <button type="button" className="auth-modal-eye" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              <div className="auth-modal-input-group">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <input
                  placeholder="Phone (10 digits)"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                />
              </div>
              <div className="auth-modal-input-group">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{alignSelf: "flex-start", marginTop: "2px"}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <textarea
                  placeholder="Address"
                  value={registerForm.address}
                  onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                  rows="2"
                  className="auth-modal-textarea"
                ></textarea>
              </div>
              <button type="submit" className="auth-modal-submit">REGISTER</button>
              <p className="auth-modal-switch-text">
                Already have an account?{" "}
                <button type="button" onClick={() => switchMode("login")} className="auth-modal-switch-link">Login</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
