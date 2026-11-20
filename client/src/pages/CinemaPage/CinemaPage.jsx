import { useEffect, useState } from "react";
import { toast } from "sonner";
import ExamManager from "../../components/ExamManager/ExamManager.jsx";
import Hero from "../../components/Hero/Hero.jsx";
import MovieList from "../../components/MovieList/MovieList.jsx";
import PremieresSection from "../../components/PremieresSection/PremieresSection.jsx";
import { movies } from "../../data/movies.js";
import { useDebounce } from "../../hooks/useDebounce.js";
import {
  loadFavorites,
  saveFavorites,
  toggleFavoriteId,
} from "../../utils/favorites.js";

// Labs 09-12 content, kept under its own route.
export default function CinemaPage() {
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 400);
  const [favorites, setFavorites] = useState(() => {
    try {
      return loadFavorites(window.localStorage, movies.map((movie) => movie.id));
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      saveFavorites(window.localStorage, favorites);
    } catch {
      /* Storage is optional. */
    }
  }, [favorites]);

  function toggleFavorite(id) {
    const movie = movies.find((item) => item.id === id);
    if (!movie) return;
    toast(favorites.includes(id) ? `Quitaste ${movie.title} de favoritas` : `Guardaste ${movie.title} en favoritas`);
    setFavorites((current) => toggleFavoriteId(current, id));
  }

  return (
    <>
      <Hero movie={movies[0]} searchText={searchText} onSearchChange={setSearchText} />
      <MovieList
        movies={movies}
        searchText={searchText === "" ? "" : debouncedSearch}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />
      <PremieresSection />
      <ExamManager />
    </>
  );
}
