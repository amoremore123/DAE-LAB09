import { useState } from "react";
import Button from "../Button/Button.jsx";

export default function PremiereCarousel({ movies }) {
  const [index, setIndex] = useState(0);
  const movie = movies[index];
  const move = (offset) => setIndex((current) => (current + offset + movies.length) % movies.length);
  return <div className="premiere-carousel" role="group" aria-label="Carrusel de estrenos">
    <img src={movie.image} alt={movie.title} />
    <div><p className="eyebrow">ESTRENO {index + 1} / {movies.length}</p>
    <h3>{movie.title}</h3><p>{movie.synopsis}</p>
    <div className="premiere-actions">
      <Button variant="secondary" onClick={() => move(-1)}>Anterior</Button>
      <Button variant="secondary" onClick={() => move(1)}>Siguiente</Button>
    </div></div>
  </div>;
}
