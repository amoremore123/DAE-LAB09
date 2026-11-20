import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Footer from "./components/Footer/Footer.jsx";
import Header from "./components/Header/Header.jsx";
import CatalogPage from "./pages/CatalogPage/CatalogPage.jsx";
import CinemaPage from "./pages/CinemaPage/CinemaPage.jsx";
import ProductFormPage from "./pages/ProductFormPage/ProductFormPage.jsx";
import "./styles/index.css";

export default function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Header />
      <main id="home">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />
          <Route path="/cartelera" element={<CinemaPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
