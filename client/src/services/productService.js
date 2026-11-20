import apiClient from "./apiClient.js";

const RESOURCE = "products/";

function toFormData(product) {
  const form = new FormData();
  Object.entries(product).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    form.append(key, value);
  });
  return form;
}

export async function list({ categoryId, signal } = {}) {
  const params = categoryId ? { category: categoryId } : {};
  const { data } = await apiClient.get(RESOURCE, { params, signal });
  return data;
}

export async function get(id, signal) {
  const { data } = await apiClient.get(`${RESOURCE}${id}/`, { signal });
  return data;
}

export async function create(product) {
  const { data } = await apiClient.post(RESOURCE, toFormData(product));
  return data;
}

export async function update(id, product) {
  const { data } = await apiClient.patch(`${RESOURCE}${id}/`, toFormData(product));
  return data;
}

export function remove(id) {
  return apiClient.delete(`${RESOURCE}${id}/`);
}

const productService = { list, get, create, update, remove };
export default productService;
