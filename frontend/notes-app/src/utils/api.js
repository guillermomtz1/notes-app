// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Debug: Log the API URL in development
console.log("=== API DEBUG INFO ===");
console.log("API_BASE_URL:", API_BASE_URL);
console.log("VITE_API_URL env var:", import.meta.env.VITE_API_URL);
console.log("Environment:", import.meta.env.MODE);
console.log("All env vars:", import.meta.env);
console.log("=====================");

export const API_ENDPOINTS = {
  NOTES: `${API_BASE_URL}/api/notes`,
  NOTE_BY_ID: (id) => `${API_BASE_URL}/api/notes/${id}`,
};

export const apiRequest = async (endpoint, options = {}) => {
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const response = await fetch(endpoint, {
    ...defaultOptions,
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
};
