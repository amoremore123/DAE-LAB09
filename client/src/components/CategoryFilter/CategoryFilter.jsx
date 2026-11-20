import "./CategoryFilter.css";

export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="category-filter" role="group" aria-label="Filtrar por categoría">
      <button type="button" aria-pressed={!selected} onClick={() => onSelect("")}>
        Todas
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          aria-pressed={selected === String(category.id)}
          onClick={() => onSelect(String(category.id))}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
