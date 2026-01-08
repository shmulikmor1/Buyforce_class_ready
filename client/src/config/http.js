import axios from "axios";
import { API_URL } from "./api";

export const http = axios.create({
  baseURL: API_URL,
});

http.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
