import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter.jsx";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import categoryService from "../../services/categoryService.js";
import productService from "../../services/productService.js";
import { describeError } from "../../services/apiClient.js";
import "./CatalogPage.css";

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") ?? "";
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    categoryService.list(controller.signal).then(setCategories).catch(() => {});
    return () => controller.abort();
  }, [attempt]);

  useEffect(() => {
    const controller = new AbortController();
    productService
      .list({ categoryId: selectedCategory, signal: controller.signal })
      .then(setProducts)
      .catch((failure) => {
        if (!controller.signal.aborted) setError(describeError(failure));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [selectedCategory, attempt]);

  function startLoading() {
    setLoading(true);
    setError("");
  }

  function selectCategory(id) {
    if (id === selectedCategory) return;
    startLoading();
    setSearchParams(id ? { category: id } : {});
  }

  function retry() {
    startLoading();
    setAttempt((n) => n + 1);
  }

  async function handleDelete(product) {
    if (!window.confirm(`¿Eliminar «${product.name}» del catálogo?`)) return;
    setDeletingId(product.id);
    try {
      await productService.remove(product.id);
      setProducts((current) => current.filter((item) => item.id !== product.id));
    } catch (failure) {
      setError(describeError(failure));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="catalog" aria-labelledby="catalog-heading">
      <div className="catalog__header">
        <div>
          <p className="eyebrow">TIENDA AURA</p>
          <h1 id="catalog-heading">Catálogo de productos</h1>
        </div>
        <Link className="catalog__new" to="/products/new">+ Nuevo producto</Link>
      </div>

      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={selectCategory}
      />

      {loading && (
        <div className="catalog__grid" role="status" aria-label="Cargando productos">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="catalog__skeleton" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="catalog__error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={retry}>Reintentar</button>
        </div>
      )}

      {!loading && !error && (
        products.length ? (
          <>
            <p className="catalog__count">{products.length} productos</p>
            <div className="catalog__grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDelete={handleDelete}
                  deleting={deletingId === product.id}
                />
              ))}
            </div>
          </>
        ) : <p className="catalog__empty">No hay productos en esta categoría.</p>
      )}
    </section>
  );
}
