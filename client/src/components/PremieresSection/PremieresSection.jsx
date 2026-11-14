import { useState } from "react";
import Button from "../Button/Button.jsx";
import PremiereSkeleton from "../PremiereSkeleton/PremiereSkeleton.jsx";
import PremiereCarousel from "../PremiereCarousel/PremiereCarousel.jsx";
import { usePremieres } from "../../hooks/usePremieres.js";

export default function PremieresSection() {
  const [fail, setFail] = useState(false);
  const { status, movies } = usePremieres(fail);
  return <section className="premieres-section" aria-labelledby="premieres-title">
    <h2 id="premieres-title">Próximos estrenos</h2>
    {status === "loading" && <PremiereSkeleton />}
    {status === "success" && <><PremiereCarousel movies={movies} />
      <Button variant="secondary" onClick={() => setFail(true)}>Simular error</Button></>}
    {status === "error" && <div className="premiere-error"><p role="alert">No se pudieron cargar los estrenos.</p>
      <Button onClick={() => setFail(false)}>Reintentar</Button></div>}
  </section>;
}
