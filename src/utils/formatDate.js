function toLocalDate(iso) {
  return new Date(`${iso}T00:00:00`);
}

export function formatShortDate(iso) {
  return toLocalDate(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDayLabel(iso) {
  return toLocalDate(iso).toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric',
  });
}
