import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const token = localStorage.getItem("token") || userInfo.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;