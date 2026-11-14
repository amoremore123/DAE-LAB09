import { useMemo } from "react";
import { useWindowSize } from "../../hooks/useWindowSize.js";
import { filterMovies } from "../../utils/search.js";
import MovieCard from "../MovieCard/MovieCard.jsx";

export default function MovieList({
  movies,
  favorites = [],
  searchText = "",
  onToggleFavorite,
}) {
  const { width } = useWindowSize();
  const columns = width >= 1024 ? 4 : width >= 540 ? 2 : 1;
  const filteredMovies = useMemo(() => filterMovies(movies, searchText), [movies, searchText]);
  return (
    <section className="movies-section" id="movies">
      <div className="section-heading">
        <div>
          <p className="eyebrow">ENCUENTRA TU PRÓXIMA HISTORIA</p>
          <h2>
            Hoy en cartelera<span>.</span>
          </h2>
        </div>
        <span>{filteredMovies.length} {filteredMovies.length === 1 ? "película" : "películas"} · Todos los géneros</span>
      </div>
      {filteredMovies.length === 0 ? (
        <div className="empty-state" role="status">
          <span aria-hidden="true">⌕</span>
          <h3>No encontramos películas</h3>
          <p>
            No hay coincidencias para «{searchText}». Prueba con otro título.
          </p>
        </div>
      ) : (
        <div className="movie-grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={favorites.includes(movie.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </section>
  );
}
