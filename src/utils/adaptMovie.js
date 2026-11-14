export function adaptMovie(source) {
  return {
    id: Number(source.id),
    title: source.title ?? source.name,
    genre: source.genre,
    synopsis: source.synopsis ?? source.overview,
    classification: source.classification,
    rating: Number(source.rating ?? source.score),
    image: source.image ?? source.poster,
    showtimes: [...(source.showtimes ?? source.sessions ?? [])],
  };
}
