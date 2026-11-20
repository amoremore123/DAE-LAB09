import apiClient from "./apiClient.js";

const RESOURCE = "categories/";

export async function list(signal) {
  const { data } = await apiClient.get(RESOURCE, { signal });
  return data;
}

export async function get(id, signal) {
  const { data } = await apiClient.get(`${RESOURCE}${id}/`, { signal });
  return data;
}

export async function create(category) {
  const { data } = await apiClient.post(RESOURCE, category);
  return data;
}

export async function update(id, category) {
  const { data } = await apiClient.patch(`${RESOURCE}${id}/`, category);
  return data;
}

export function remove(id) {
  return apiClient.delete(`${RESOURCE}${id}/`);
}

const categoryService = { list, get, create, update, remove };
export default categoryService;
