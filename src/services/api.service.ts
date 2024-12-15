import axios from "axios";
// import { ApiResponse, PaginatedResponse, Movie } from "@/types/api.types";

export const apiClient = axios.create({
  method: "GET",
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
  },
});

// Add request interceptor for error handling and logging
apiClient.interceptors.request.use((config) => {
  // Add request logging in development
  if (import.meta.env.DEV) {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
});

// Add response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error("API Error:", error.response?.data || error.message);
    }

    // Implement retry logic for network errors
    if (!error.response && error.request) {
      // Network error handling
      return Promise.reject(
        new Error("Network error occurred. Please check your connection."),
      );
    }

    return Promise.reject(error);
  },
);
