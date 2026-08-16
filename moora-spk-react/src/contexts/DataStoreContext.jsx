import { useState, useCallback, useEffect, useContext } from 'react';
import { generateId } from '../lib/utils';
import * as api from '../lib/api';
import { AuthContext } from './authContext';
import { DataStoreContext } from './dataStoreContext';

export { DataStoreContext };

const STORAGE_KEY = 'moora_dss_data';

const CRITERIA = [
  { code: 'C1',  name: 'Harga Mesin',            type: 'cost',    weight: 0.25, unit: 'Rupiah' },
  { code: 'C2',  name: 'Daya Motor',             type: 'benefit', weight: 0.15, unit: 'Watt/Hp' },
  { code: 'C3',  name: 'Kapasitas Potong',       type: 'benefit', weight: 0.15, unit: 'mm' },
  { code: 'C4',  name: 'Kecepatan Potong',       type: 'benefit', weight: 0.10, unit: 'm/min' },
  { code: 'C5',  name: 'Konsumsi Listrik',       type: 'cost',    weight: 0.10, unit: 'Watt/Hp' },
  { code: 'C6',  name: 'Tingkat Presisi',        type: 'benefit', weight: 0.08, unit: 'Skor 1-10' },
  { code: 'C7',  name: 'Garansi Produk',         type: 'benefit', weight: 0.05, unit: 'Tahun' },
  { code: 'C8',  name: 'Kemudahan Maintenance',  type: 'benefit', weight: 0.05, unit: 'Skor 1-10' },
  { code: 'C9',  name: 'Ketersediaan Sparepart', type: 'benefit', weight: 0.04, unit: 'Skor 1-10' },
  { code: 'C10', name: 'Umur Pakai Mesin',       type: 'benefit', weight: 0.03, unit: 'Tahun' },
];

export function DataStoreProvider({ children }) {
  const { isLoggedIn } = useContext(AuthContext);
  const [alternatives, setAlternatives] = useState(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch { /* ignore */ }
    return [];
  });

  // Save to localStorage whenever alternatives change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alternatives));
    } catch { /* storage full */ }
  }, [alternatives]);

  const getCriteria = useCallback(() => {
    return [...CRITERIA];
  }, []);

  const addAlternative = useCallback((name, values) => {
    const id = generateId();
    const newAlt = { id, name, values: [...values] };
    setAlternatives((prev) => [...prev, newAlt]);

    // Sync to server
    if (isLoggedIn) {
      api.addAlternative(name, values).then((data) => {
        if (data.success && data.db_id) {
          setAlternatives((prev) =>
            prev.map((a) =>
              a.id === id ? { ...a, id: data.id, db_id: data.db_id } : a
            )
          );
        }
      }).catch(() => {});
    }

    return id;
  }, [isLoggedIn]);

  const updateAlternative = useCallback((id, name, values) => {
    let dbId = null;
    setAlternatives((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          dbId = a.db_id;
          return { ...a, name, values: [...values] };
        }
        return a;
      })
    );

    if (isLoggedIn && dbId) {
      api.updateAlternative(dbId, name, values).catch(() => {});
    }
  }, [isLoggedIn]);

  const deleteAlternative = useCallback((id) => {
    let dbId = null;
    setAlternatives((prev) => {
      const alt = prev.find((a) => a.id === id);
      if (alt) dbId = alt.db_id;
      return prev.filter((a) => a.id !== id);
    });

    if (isLoggedIn && dbId) {
      api.deleteAlternative(dbId).catch(() => {});
    }
  }, [isLoggedIn]);

  const loadFromServer = useCallback(async () => {
    if (!isLoggedIn) return { success: false };
    try {
      const data = await api.getAlternatives();
      if (data.success && Array.isArray(data.alternatives)) {
        setAlternatives(data.alternatives);
        return { success: true, count: data.alternatives.length };
      }
    } catch {
      // fallback to localStorage
    }
    return { success: false };
  }, [isLoggedIn]);

  // Seed 10 default alternatives into the database
  const seedDefaults = useCallback(async () => {
    if (!isLoggedIn) {
      return { success: false, message: 'Anda harus login untuk seed data.' };
    }
    try {
      const data = await api.seedAlternatives();
      if (data.success && Array.isArray(data.alternatives)) {
        setAlternatives(data.alternatives);
      }
      return data;
    } catch {
      return { success: false, message: 'Gagal seed data ke server.' };
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      // Defer to avoid synchronous setState within effect body
      const controller = new AbortController();
      (async () => {
        try {
          const data = await api.getAlternatives();
          if (!controller.signal.aborted && data.success && Array.isArray(data.alternatives)) {
            setAlternatives(data.alternatives);
          }
        } catch { /* fallback to localStorage */ }
      })();
      return () => controller.abort();
    }
  }, [isLoggedIn]);

  const saveHistoryToServer = useCallback(async (title, alternativesData, result) => {
    if (!isLoggedIn) {
      return { success: false, message: 'Anda harus login untuk menyimpan history.' };
    }
    return api.saveHistory(title, alternativesData, result.ranking, result.yi);
  }, [isLoggedIn]);

  const resetToDefaults = useCallback(() => {
    setAlternatives([]);
  }, []);

  return (
    <DataStoreContext.Provider
      value={{
        alternatives,
        criteria: CRITERIA,
        getCriteria,
        addAlternative,
        updateAlternative,
        deleteAlternative,
        loadFromServer,
        seedDefaults,
        saveHistory: saveHistoryToServer,
        resetToDefaults,
        alternativeCount: alternatives.length,
      }}
    >
      {children}
    </DataStoreContext.Provider>
  );
}
