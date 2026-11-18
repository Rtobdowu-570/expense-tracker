import { formatCurrency } from '../utils/formatCurrency';

function CategoryBar({ breakdown = [] }) {
  return (
    <div className="breakdown">
      <div className="breakdown-text">Breakdown by category</div>

      <div className="breakdown-bar" aria-hidden="true">
        {breakdown.map((category) => (
          <div
            key={category.id}
            className="breakdown-segment"
            style={{ width: `${category.percent}%`, background: category.color }}
          />
        ))}
      </div>

      <div className="breakdown-details">
        {breakdown.map((category) => (
          <div key={category.id} className="breakdown-row">
            <div className="category">
              <span
                className="category-colour"
                style={{ background: category.color }}
              />
              <span className="category-label">{category.label}</span>
            </div>
            <div className="category-figure">
              <span className="percentage">{Math.round(category.percent)}%</span>
              <span className="category-amount">
                {formatCurrency(category.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryBar;
