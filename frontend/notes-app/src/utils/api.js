// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  NOTES: `${API_BASE_URL}/api/notes`,
  NOTE_BY_ID: (id) => `${API_BASE_URL}/api/notes/${id}`,
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = await window.Clerk?.session?.getToken();

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
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
