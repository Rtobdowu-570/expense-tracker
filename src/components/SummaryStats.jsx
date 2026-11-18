import { formatCurrency } from '../utils/formatCurrency';

function SummaryStats({ total, count, categoryCount, topCategory }) {
  return (
    <div className="stats">
      <div className="money-stats">
        <div className="stats-heading">Total spent</div>
        <div className="stats-result">{formatCurrency(total)}</div>
      </div>

      <div className="expense-stats">
        <div className="stats-heading">Expenses</div>
        <div className="stats-result">{count}</div>
        <div className="stats-info">across {categoryCount} {categoryCount === 1 ? 'category' : 'categories'}</div>
      </div>

      <div className="category-stats">
        <div className="stats-heading">Top category</div>
        {topCategory ? (
          <>
            <div className="stats-result">{topCategory.label}</div>
            <div className="stats-info">
              {formatCurrency(topCategory.amount)} &#183; {Math.round(topCategory.percent)}%
            </div>
          </>
        ) : (
          <div className="stats-result">&#8212;</div>
        )}
      </div>
    </div>
  );
}

export default SummaryStats;
