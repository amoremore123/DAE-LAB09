import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <NavLink className="brand" to="/">
        <span className="brand-mark">a</span>tienda aura
        <span className="brand-dot">.</span>
      </NavLink>
      <nav aria-label="Navegación principal">
        <NavLink to="/" end>Catálogo</NavLink>
        <NavLink to="/products/new">Nuevo producto</NavLink>
        <NavLink to="/cartelera">Cartelera</NavLink>
      </nav>
      <span className="location">Lima, Perú</span>
    </header>
  );
}
