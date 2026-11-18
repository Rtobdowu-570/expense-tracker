export function formatCurrency(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return '$0.00';
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}
