export const FAVORITES_KEY = "cine-aura-favorites";
export function loadFavorites(storage, validIds) {
  try {
    const saved = JSON.parse(storage?.getItem(FAVORITES_KEY) ?? "[]");
    return Array.isArray(saved)
      ? [...new Set(saved.filter((id) => validIds.includes(id)))]
      : [];
  } catch {
    return [];
  }
}
export function toggleFavoriteId(current, id) {
  return current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id];
}
export function saveFavorites(storage, favorites) {
  try {
    storage?.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true;
  } catch {
    return false;
  }
}
