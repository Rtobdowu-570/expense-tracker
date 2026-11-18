import { formatCurrency } from '../utils/formatCurrency';

function DateGroup({ currentDate, totalPerDay, children }) {
  return (
    <div className="date-group">
      <div className="date-bar">
        <div className="current-date">{currentDate}</div>
        <div className="sub-total">{formatCurrency(totalPerDay)}</div>
      </div>
      <ul className="expense-rows">{children}</ul>
    </div>
  );
}

export default DateGroup;
