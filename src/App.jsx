import { useEffect, useState } from "react";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Hero from "./components/Hero/Hero.jsx";
import MovieList from "./components/MovieList/MovieList.jsx";
import { movies } from "./data/movies.js";
import {
  loadFavorites,
  saveFavorites,
  toggleFavoriteId,
} from "./utils/favorites.js";
import { useDebouncedValue } from "./hooks/useDebouncedValue.js";
import "./styles/index.css";

export default function App() {
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebouncedValue(searchText, 400);
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
  function toggleFavorite(id) {
    setFavorites((current) => toggleFavoriteId(current, id));
  }
  return (
    <>
      <Header favoritesCount={favorites.length} />
      <main id="home">
        <Hero
          movie={movies[0]}
          searchText={searchText}
          onSearchChange={setSearchText}
        />
        <MovieList
          movies={movies}
          searchText={debouncedSearch}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      </main>
      <Footer />
    </>
  );
}
