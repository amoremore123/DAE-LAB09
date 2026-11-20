import apiClient from "./apiClient.js";

export async function listExams(signal) {
  const { data } = await apiClient.get("exams/", { signal });
  return data.results ?? data;
}

export function createExam(title) {
  return apiClient.post("exams/", { title });
}

export function deleteExam(id) {
  return apiClient.delete(`exams/${id}/`);
}
