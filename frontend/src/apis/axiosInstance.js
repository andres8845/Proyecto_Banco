// src/apis/axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});

// Interceptor para agregar el token de autorización y mostrar logs
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // DEBUG: Mostrar token y headers en consola
  console.log("[Axios] URL:", config.baseURL + config.url);
  console.log("[Axios] Token:", token);
  console.log("[Axios] Headers:", config.headers);
  return config;
});

// Cache-buster para peticiones GET
instance.interceptors.request.use((config) => {
  if ((config.method || "get").toLowerCase() === "get") {
    config.params = { ...(config.params || {}), _ts: Date.now() };
    config.headers = {
      ...(config.headers || {}),
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    };
  }
  return config;
});

export default instance;
