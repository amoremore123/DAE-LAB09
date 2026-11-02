import Button from "../Button/Button.jsx";
export default function MovieCard({
  movie,
  isFavorite = false,
  onToggleFavorite,
}) {
  return (
    <article className="movie-card">
      <div className="poster">
        <img
          src={movie.image}
          alt={`Afiche de ${movie.title}`}
          loading="lazy"
        />
        <span className="classification">{movie.classification}</span>
      </div>
      <div className="movie-heading">
        <h3>{movie.title}</h3>
        <span className="score">★ {movie.rating.toFixed(1)}</span>
      </div>
      <p className="genre">{movie.genre}</p>
      <p className="synopsis">{movie.synopsis}</p>
      <div className="showtimes" aria-label={`Horarios de ${movie.title}`}>
        {movie.showtimes.map((time) => (
          <span key={time}>{time}</span>
        ))}
      </div>
      <Button
        variant={isFavorite ? "favorite" : "secondary"}
        className="favorite-button"
        aria-pressed={isFavorite}
        aria-label={`${isFavorite ? "Quitar" : "Agregar"} ${movie.title} ${isFavorite ? "de" : "a"} favoritas`}
        onClick={() => onToggleFavorite(movie.id)}
      >
        {isFavorite ? "♥ Guardada" : "♡ Guardar favorita"}
      </Button>
    </article>
  );
}
