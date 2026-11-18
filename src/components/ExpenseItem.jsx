import { formatCurrency } from '../utils/formatCurrency';
import { formatShortDate } from '../utils/formatDate';
import { getCategory } from '../constants/categories';
import RowMenu from './RowMenu';

function ExpenseItem({ expense, menuOpen, onToggleMenu, onEdit, onDelete }) {
  const category = getCategory(expense.category);
  const title = expense.note || category?.label || 'Expense';

  return (
    <li className="expense-details">
      <div className="expense-info">
        <span
          className="expense-color"
          style={{ background: category?.color ?? '#c4c7c7' }}
        />
        <div className="expense-info-text">
          <div className="expense-header-text">{title}</div>
          <div className="expense-text">
            <span className="category-text">{category?.label ?? 'Uncategorised'}</span>
            <span className="date-text">{formatShortDate(expense.date)}</span>
          </div>
        </div>
      </div>

      <div className="expense-amount">
        <span className="amount-text">{formatCurrency(expense.amount)}</span>
        <button
          type="button"
          className="dropdown"
          aria-label={`Actions for ${title}`}
          aria-expanded={menuOpen}
          onClick={onToggleMenu}
        >
          &#183;&#183;&#183;
        </button>
        {menuOpen && <RowMenu onEdit={onEdit} onDelete={onDelete} />}
      </div>
    </li>
  );
}

export default ExpenseItem;
