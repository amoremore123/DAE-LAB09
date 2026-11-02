import MovieCard from "../MovieCard/MovieCard.jsx";

export default function MovieList({ movies, favorites = [], onToggleFavorite }) {
  return (
    <section className="movies-section" id="movies">
      <div className="section-heading">
        <div>
          <p className="eyebrow">ENCUENTRA TU PRÓXIMA HISTORIA</p>
          <h2>
            Hoy en cartelera<span>.</span>
          </h2>
        </div>
        <span>{movies.length} películas · Todos los géneros</span>
      </div>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} isFavorite={favorites.includes(movie.id)} onToggleFavorite={onToggleFavorite} />
        ))}
      </div>
    </section>
  );
}
