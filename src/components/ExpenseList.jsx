import { useState } from 'react';
import DateGroup from './DateGroup';
import EmptyState from './EmptyState';
import ExpenseItem from './ExpenseItem';
import { groupByDate } from '../utils/groupByDate';

function ExpenseList({ expenses, totalCount, onEdit, onDelete, onClearFilters, children }) {
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (id) => setOpenMenuId((current) => (current === id ? null : id));

  let body;
  if (totalCount === 0) {
    body = <EmptyState variant="first-run" />;
  } else if (expenses.length === 0) {
    body = <EmptyState variant="no-match" onClearFilters={onClearFilters} />;
  } else {
    body = groupByDate(expenses).map((group) => (
      <DateGroup key={group.date} currentDate={group.label} totalPerDay={group.subtotal}>
        {group.items.map((expense) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            menuOpen={openMenuId === expense.id}
            onToggleMenu={() => toggleMenu(expense.id)}
            onEdit={() => onEdit(expense)}
            onDelete={() => onDelete(expense.id)}
          />
        ))}
      </DateGroup>
    ));
  }

  return (
    <section className="expense-tab">
      <div className="expense-heading">
        <div className="expense-header-text">Expenses</div>
        <div className="expense-total-count">
          Showing {expenses.length} of {totalCount}
        </div>
      </div>

      <div className="expense-card">
        {totalCount > 0 && children}
        {body}
      </div>
    </section>
  );
}

export default ExpenseList;
