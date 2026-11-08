'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { toast } from 'sonner';

export { toast };

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const opts = { duration };
    if (type === 'error') {
      toast.error(message, opts);
    } else if (type === 'info') {
      toast.info(message, opts);
    } else if (type === 'warning') {
      toast.warning(message, opts);
    } else {
      toast.success(message, opts);
    }
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, toast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback to sonner toast directly if used outside provider
    return {
      addToast: (msg, type = 'success') => {
        if (type === 'error') toast.error(msg);
        else if (type === 'info') toast.info(msg);
        else if (type === 'warning') toast.warning(msg);
        else toast.success(msg);
      },
      toast,
    };
  }
  return context;
};
