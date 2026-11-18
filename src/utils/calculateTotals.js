import { CATEGORIES } from "../constants/categories";


export function calculateTotals(expenses) {

  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  const sums = new Map();
  for (const expense of expenses) {
    sums.set(expense.category, (sums.get(expense.category) ?? 0) + Number(expense.amount))
  }

  const byCategory = CATEGORIES
    .filter((category) => sums.has(category.id))
    .map((category) => {
      const amount = sums.get(category.id)
      return {
        id: category.id,
        label: category.label,
        color: category.color,
        amount,
        percent: total > 0 ? (amount / total) * 100 : 0,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  return {
    total,
    count: expenses.length,
    byCategory,
    topCategory: byCategory[0] ?? null,
  };
}
