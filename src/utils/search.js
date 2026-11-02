export function normalizeText(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .trim();
}
export function filterMovies(movies, query) {
  const normalizedQuery = normalizeText(query);
  return movies.filter((movie) =>
    normalizeText(movie.title).includes(normalizedQuery),
  );
}
