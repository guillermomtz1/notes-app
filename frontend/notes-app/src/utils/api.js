// API configuration
const API_BASE_URL = "https://bragjournal-backend.vercel.app";

// Debug: Log the API URL in development
if (import.meta.env.DEV) {
  console.log("API_BASE_URL:", API_BASE_URL);
  console.log("VITE_API_URL env var:", import.meta.env.VITE_API_URL);
}

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
