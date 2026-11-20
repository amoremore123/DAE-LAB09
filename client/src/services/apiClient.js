import axios from "axios";

// The only place in the client that knows where the API lives.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8013/api/",
  timeout: 8000,
});

export function describeError(error) {
  const details = error.response?.data;
  if (details && typeof details === "object" && !details.detail) {
    const messages = Object.entries(details).map(([field, value]) =>
      `${field}: ${Array.isArray(value) ? value.join(" ") : value}`,
    );
    if (messages.length) return messages.join(" · ");
  }
  if (typeof details?.detail === "string") return details.detail;
  if (error.response) return `La API respondió con el código ${error.response.status}.`;
  return "No se pudo conectar con Django. Comprueba que el servidor esté activo.";
}

export default apiClient;
