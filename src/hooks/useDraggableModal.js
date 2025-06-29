// src/hooks/useDraggableModal.js
import { useState, useRef, useCallback } from 'react';

export const useDraggableModal = (onClose) => {
    const [isDragging, setIsDragging] = useState(false);
    const [translateY, setTranslateY] = useState(0);
    const dragStartY = useRef(0);

    const handleTouchStart = useCallback((e) => {
        setIsDragging(true);
        dragStartY.current = e.touches[0].clientY;
        // Убираем плавный переход на время перетаскивания
        e.currentTarget.style.transition = 'none';
    }, []);

    const handleTouchMove = useCallback((e) => {
        if (!isDragging) return;

        const currentY = e.touches[0].clientY;
        const deltaY = currentY - dragStartY.current;

        // Позволяем тащить только вниз
        if (deltaY > 0) {
            e.currentTarget.style.transform = `translateY(${deltaY}px)`;
            setTranslateY(deltaY);
        }
    }, [isDragging]);

    const handleTouchEnd = useCallback((e) => {
        if (!isDragging) return;

        setIsDragging(false);
        const modalElement = e.currentTarget;
        const modalHeight = modalElement.offsetHeight;
        
        // Включаем обратно плавный переход для анимации
        modalElement.style.transition = 'transform 0.3s ease-out';

        // Если пользователь перетащил окно более чем на 30% его высоты, закрываем
        if (translateY > modalHeight * 0.3) {
            modalElement.style.transform = `translateY(100vh)`; // Анимируем полное скрытие
            setTimeout(onClose, 300); // Вызываем onClose после завершения анимации
        } else {
            // Иначе возвращаем окно в исходное положение
            modalElement.style.transform = 'translateY(0px)';
        }
        dragStartY.current = 0;
        setTranslateY(0);
    }, [isDragging, translateY, onClose]);

    // Возвращаем объект с обработчиками событий, которые мы повесим на элемент модального окна
    return {
        touchHandlers: {
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd,
        }
    };
};