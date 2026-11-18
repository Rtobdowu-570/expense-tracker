import { CATEGORIES } from '../constants/categories';

function FilterBar({ filters, onChange }) {
  return (
    <div className="filter-tab">
      <div className="filter">
        <label className="sr-only" htmlFor="filter-search">Search notes</label>
        <input
          id="filter-search"
          type="text"
          placeholder="Search notes"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </div>

      <div className="filter">
        <label className="sr-only" htmlFor="filter-category">Filter by category</label>
        <select
          id="filter-category"
          value={filters.category}
          onChange={(e) => onChange({ category: e.target.value })}
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((category) => (
            <option key={category.id} value={category.id}>{category.label}</option>
          ))}
        </select>
      </div>

      <div className="filter">
        <label className="sr-only" htmlFor="filter-from">From date</label>
        <input
          id="filter-from"
          type="date"
          value={filters.from}
          onChange={(e) => onChange({ from: e.target.value })}
        />
      </div>

      <div className="filter">
        <label className="sr-only" htmlFor="filter-to">To date</label>
        <input
          id="filter-to"
          type="date"
          value={filters.to}
          min={filters.from || undefined}
          onChange={(e) => onChange({ to: e.target.value })}
        />
      </div>
    </div>
  );
}

export default FilterBar;
