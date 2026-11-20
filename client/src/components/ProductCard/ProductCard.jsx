import { Link } from "react-router-dom";
import "./ProductCard.css";

const currency = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });

export default function ProductCard({ product, onDelete, deleting = false }) {
  const { id, name, description, price, stock, image, category } = product;
  return (
    <article className="product-card">
      {image
        ? <img src={image} alt={name} loading="lazy" />
        : <div className="product-card__placeholder" aria-hidden="true">Sin imagen</div>}
      <div className="product-card__body">
        <span className="product-card__category" title={category.description}>
          {category.name}
        </span>
        <h3>{name}</h3>
        <p>{description}</p>
        <div className="product-card__meta">
          <strong>{currency.format(Number(price))}</strong>
          <span>{stock} en stock</span>
        </div>
        <div className="product-card__actions">
          <Link to={`/products/${id}/edit`}>Editar</Link>
          <button type="button" onClick={() => onDelete(product)} disabled={deleting}>
            {deleting ? "Eliminando…" : "Eliminar"}
          </button>
        </div>
      </div>
    </article>
  );
}
