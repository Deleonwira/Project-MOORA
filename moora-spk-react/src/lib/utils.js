/**
 * MOORA DSS — Utility Functions
 */

export function formatNumber(number, decimals = 4) {
  if (number === null || number === undefined || isNaN(number)) return '—';
  return Number(number).toFixed(decimals);
}

export function generateId() {
  return 'alt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
}

export function escapeHtml(str) {
  if (!str) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(str).replace(/[&<>"']/g, (c) => map[c]);
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
