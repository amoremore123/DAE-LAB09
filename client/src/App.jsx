import { useEffect, useState } from "react";
import Header from "./components/Header/Header.jsx";
import ExamManager from "./components/ExamManager/ExamManager.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Hero from "./components/Hero/Hero.jsx";
import MovieList from "./components/MovieList/MovieList.jsx";
import { movies } from "./data/movies.js";
import {
  loadFavorites,
  saveFavorites,
  toggleFavoriteId,
} from "./utils/favorites.js";
import { useDebounce } from "./hooks/useDebounce.js";
import PremieresSection from "./components/PremieresSection/PremieresSection.jsx";
import { Toaster, toast } from "sonner";
import "./styles/index.css";

export default function App() {
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 400);
  const [favorites, setFavorites] = useState(() => {
    try {
      return loadFavorites(
        window.localStorage,
        movies.map((movie) => movie.id),
      );
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
  const favoritesCount = favorites.length;
  function toggleFavorite(id) {
    const movie = movies.find((item) => item.id === id);
    if (!movie) return;
    toast(favorites.includes(id) ? `Quitaste ${movie.title} de favoritas` : `Guardaste ${movie.title} en favoritas`);
    setFavorites((current) => toggleFavoriteId(current, id));
  }
  return (
    <>
      <Toaster position="top-center" />
      <Header favoritesCount={favoritesCount} />
      <main id="home">
        <Hero
          movie={movies[0]}
          searchText={searchText}
          onSearchChange={setSearchText}
        />
        <MovieList
          movies={movies}
          searchText={searchText === "" ? "" : debouncedSearch}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
        <PremieresSection />
        <ExamManager />
      </main>
      <Footer />
    </>
  );
}
