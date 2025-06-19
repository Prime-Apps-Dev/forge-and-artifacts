import { useState, useCallback } from 'react';

// Хук для управления системой уведомлений (тостов)
export function useNotifications() {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info') => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev.slice(-5), { id, message, type }]); // Ограничиваем количество тостов
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return { toasts, showToast, removeToast };
}