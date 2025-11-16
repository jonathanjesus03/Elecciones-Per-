// src/api/apiClient.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://elecciones-backend-59y8.onrender.com/api",
  timeout: 10000, 
});


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);
