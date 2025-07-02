import axios from "axios";

// Base URL for auth API endpoints
const API_BASE_URL = "api/auth";

// Axios Instance with default comfig
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // For better security always keep timeout don't comment it out
});

// Attaching token to all header of req. interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
