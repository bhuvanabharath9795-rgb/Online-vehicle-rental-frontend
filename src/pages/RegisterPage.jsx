import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });
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
    <div className="max-w-lg mx-auto card p-6">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={submitHandler} className="space-y-3">
        <input className="input" placeholder="Full Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="input" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <input className="input" placeholder="Phone" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <textarea className="input" placeholder="Address" onChange={(e) => setForm({ ...form, address: e.target.value })}></textarea>
        <button className="btn btn-primary w-full">Register</button>
      </form>
      <p className="mt-4 text-sm">Already have an account? <Link className="text-blue-700" to="/login">Login</Link></p>
    </div>
  );
}
