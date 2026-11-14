import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8012/api/",
  timeout: 8000,
});

export async function listExams(signal) {
  const { data } = await api.get("exams/", { signal });
  return data.results ?? data;
}

export function createExam(title) {
  return api.post("exams/", { title });
}

export function deleteExam(id) {
  return api.delete(`exams/${id}/`);
}

export function describeError(error) {
  const details = error.response?.data;
  const titleError = details?.title;
  if (Array.isArray(titleError)) return titleError.join(" ");
  if (typeof details?.detail === "string") return details.detail;
  if (error.response) return `La API respondió con el código ${error.response.status}.`;
  return "No se pudo conectar con Django. Comprueba que el servidor esté activo.";
}
