import { useState, useCallback, useRef } from 'react';
import { ToastContext } from './toastContext';

export { ToastContext };

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: '', type: 'info', visible: false });
  const timeoutRef = useRef(null);

  const showToast = useCallback((message, type = 'info') => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast({ message, type, visible: true });
    timeoutRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
      timeoutRef.current = null;
    }, 3000);
  }, []);

  const hideToast = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast((prev) => ({ ...prev, visible: false }));
    timeoutRef.current = null;
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
}
