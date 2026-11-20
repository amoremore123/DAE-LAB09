import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import categoryService from "../../services/categoryService.js";
import productService from "../../services/productService.js";
import { describeError } from "../../services/apiClient.js";
import "./ProductFormPage.css";

const EMPTY = { name: "", description: "", price: "", stock: "0", category_id: "" };

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const requests = [categoryService.list(controller.signal)];
    if (isEdit) requests.push(productService.get(id, controller.signal));
    Promise.all(requests)
      .then(([categoryList, product]) => {
        setCategories(categoryList);
        if (product) {
          setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: String(product.stock),
            category_id: String(product.category.id),
          });
          setCurrentImage(product.image ?? "");
        }
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(describeError(failure));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [id, isEdit]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = { ...form, image: image ?? undefined };
    try {
      if (isEdit) await productService.update(id, payload);
      else await productService.create(payload);
      navigate("/");
    } catch (failure) {
      setError(describeError(failure));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="product-form__status" role="status">Cargando formulario…</p>;

  return (
    <section className="product-form" aria-labelledby="form-heading">
      <p className="eyebrow">TIENDA AURA</p>
      <h1 id="form-heading">{isEdit ? "Editar producto" : "Nuevo producto"}</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label>
          Nombre
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Descripción
          <textarea name="description" rows="3" value={form.description} onChange={handleChange} />
        </label>
        <div className="product-form__row">
          <label>
            Precio (S/)
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required />
          </label>
          <label>
            Existencias
            <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required />
          </label>
        </div>
        <label>
          Categoría
          <select name="category_id" value={form.category_id} onChange={handleChange} required>
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <label>
          Imagen {isEdit && currentImage && <small>(deja vacío para conservar la actual)</small>}
          <input type="file" accept="image/*" onChange={(event) => setImage(event.target.files[0] ?? null)} />
        </label>
        {error && <p className="product-form__error" role="alert">{error}</p>}
        <div className="product-form__actions">
          <button type="submit" disabled={saving}>{saving ? "Guardando…" : "Guardar"}</button>
          <Link to="/">Cancelar</Link>
        </div>
      </form>
    </section>
  );
}
