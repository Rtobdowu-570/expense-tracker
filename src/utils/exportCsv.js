import { getCategory } from '../constants/categories';

function sanitize(value) {
  const text = String(value ?? '');
  return /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
}

function escapeCsv(value) {
  return `"${sanitize(value).replace(/"/g, '""')}"`;
}

export function exportCsv(expenses) {
  if (!expenses.length) {
    console.warn('No expenses available to export.');
    return;
  }

  const headers = ['Date', 'Note', 'Category', 'Amount'];

  const rows = expenses.map((expense) => [
    expense.date,
    expense.note,
    getCategory(expense.category)?.label ?? expense.category,
    Number(expense.amount).toFixed(2),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsv).join(','))
    .join('\r\n');


  const blob = new Blob(['\ufeff', csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'expenses.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
