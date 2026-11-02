import Button from "../Button/Button.jsx";
export default function MovieSearch({ value, onChange }) {
  function handleSubmit(event) {
    event.preventDefault();
    document.getElementById("movies")?.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <form className="movie-search" role="search" onSubmit={handleSubmit}>
      <label htmlFor="movie-query">¿Qué película quieres ver?</label>
      <div className="search-controls">
        <input
          id="movie-query"
          name="query"
          type="search"
          placeholder="Busca una película…"
          autoComplete="off"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            if (import.meta.env.DEV)
              console.info("[search-input]", event.target.value);
          }}
        />
        <Button type="submit">Ver cartelera ↗</Button>
      </div>
      <p className="search-hint">
        Encuentra tu próxima historia por su título.
      </p>
    </form>
  );
}
