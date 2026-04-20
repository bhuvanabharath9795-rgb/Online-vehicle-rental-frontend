import axios from "axios";

const API = axios.create({
  baseURL: "https://online-vehicle-rental-backend.onrender.com",
  withCredentials: true,
});

// ✅ use same variable name (API)
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    config.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
  }
  return config;
});

export default API;
