// src/hooks/useNotifications.js
import { useState, useCallback } from 'react';

export function useNotifications() {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info') => {
        const id = Date.now() + Math.random();
        // ИЗМЕНЕНИЕ: Ограничиваем количество тостов до 3 (slice(-2) + 1 новый = 3)
        setToasts(prev => [...prev.slice(-2), { id, message, type }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return { toasts, showToast, removeToast };
}