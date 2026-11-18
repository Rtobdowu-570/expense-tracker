import { formatDayLabel } from './formatDate';
import { roundMoney } from './roundMoney';

export function groupByDate(expenses) {
  const days = new Map();

  for (const expense of expenses) {
    if (!days.has(expense.date)) days.set(expense.date, []);
    days.get(expense.date).push(expense);
  }

  return [...days.entries()]
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([date, items]) => ({
      date,
      label: formatDayLabel(date),
      subtotal: roundMoney(items.reduce((sum, item) => sum + Number(item.amount), 0)),
      items,
    }));
}
