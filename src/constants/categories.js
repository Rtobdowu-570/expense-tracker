export const CATEGORIES = [
  { id: 'housing', label: 'Housing',      color: '#7a6a52' },
  { id: 'travel',  label: 'Travel',       color: '#5b7fa3' },
  { id: 'food',    label: 'Food & drink', color: '#8fa882' },
  { id: 'work',    label: 'Work',         color: '#8e7fa6' },
  { id: 'health',  label: 'Health',       color: '#c09a6b' },
];

export function getCategory(id) {
  return CATEGORIES.find((category) => category.id === id) ?? null;
}
