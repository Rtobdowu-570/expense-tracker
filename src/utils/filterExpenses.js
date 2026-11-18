export function filterExpenses(expenses, filters) {
  const searchQuery = filters.search.trim().toLowerCase();

  return expenses.filter((expense) => {
    // Filter category
    if (filters.category !== 'all' && expense.category !== filters.category) return false;

    // Filter note
    if (searchQuery && !(expense.note ?? '').toLowerCase().includes(searchQuery)) return false;

    // Filter date
    if (filters.from && expense.date < filters.from) return false;
    if (filters.to && expense.date > filters.to) return false;

    return true;
  });
}
