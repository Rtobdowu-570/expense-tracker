// crypto.randomUUID() only exists on HTTPS / localhost. Fall back so the app
// still works when opened via a LAN address (e.g. from a phone on dev server).
export function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
