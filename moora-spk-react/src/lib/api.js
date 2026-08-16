/**
 * MOORA DSS — API Client
 * Wraps fetch calls to PHP backend
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    return data;
  } catch {
    return { success: false, message: 'Koneksi gagal. Pastikan server berjalan.' };
  }
}

// Auth
export const authCheck = () => request('/auth/check.php');
export const authLogin = (email, password) =>
  request('/auth/login.php', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
export const authRegister = (nama, email, password) =>
  request('/auth/register.php', {
    method: 'POST',
    body: JSON.stringify({ nama, email, password }),
  });
export const authLogout = () =>
  request('/auth/logout.php', { method: 'POST' });

// Alternatives
export const getAlternatives = () => request('/alternatives.php');
export const addAlternative = (name, values) =>
  request('/alternatives.php', {
    method: 'POST',
    body: JSON.stringify({ name, values }),
  });
export const updateAlternative = (dbId, name, values) =>
  request('/alternatives.php', {
    method: 'PUT',
    body: JSON.stringify({ db_id: dbId, name, values }),
  });
export const deleteAlternative = (dbId) =>
  request(`/alternatives.php?db_id=${dbId}`, {
    method: 'DELETE',
    body: JSON.stringify({ db_id: dbId }),
  });
export const seedAlternatives = () =>
  request('/seed.php', { method: 'POST' });

// History
export const getHistory = () => request('/history/list.php');
export const getHistoryDetail = (id) => request(`/history/detail.php?id=${id}`);
export const saveHistory = (title, alternatives, ranking, yi) =>
  request('/history/save.php', {
    method: 'POST',
    body: JSON.stringify({ title, alternatives, ranking, yi }),
  });
export const deleteHistory = (id) =>
  request(`/history/delete.php?id=${id}`, { method: 'DELETE' });
