import { useEffect, useState } from "react";
import { adaptMovie } from "../utils/adaptMovie.js";
import { movies } from "../data/movies.js";

export function usePremieres(fail = false) {
  const [result, setResult] = useState({ status: "loading", movies: [] });
  useEffect(() => {
    
    const timer = setTimeout(() => {
      setResult({ fail, value: fail
        ? { status: "error", movies: [] }
        : { status: "success", movies: movies.slice(0, 4).map(({ title, synopsis, image, rating, ...movie }) =>
            adaptMovie({ ...movie, name: title, overview: synopsis, poster: image, score: rating })) } });
    }, 1100);
    return () => clearTimeout(timer);
  }, [fail]);
  return result.fail === fail ? result.value : { status: "loading", movies: [] };
}

