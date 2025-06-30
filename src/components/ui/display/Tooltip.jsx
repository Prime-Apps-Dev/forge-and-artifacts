// src/components/ui/display/Tooltip.jsx
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

const Tooltip = ({ text, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    
    const wrapperRef = useRef(null);
    const tooltipRef = useRef(null);
    
    // ИСПРАВЛЕНИЕ: Этот вызов хука useRef перенесен внутрь компонента.
    // Теперь он не нарушает "Правила Хуков".
    const isTouchDeviceRef = useRef(
        typeof window !== 'undefined' && 
        ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    );

    // Этот эффект вычисляет позицию tooltip ПЕРЕД тем, как браузер его отрисует.
    // Это предотвращает "прыжки" элемента.
    useLayoutEffect(() => {
        if (isVisible && wrapperRef.current && tooltipRef.current) {
            const wrapperRect = wrapperRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const viewport = {
                width: window.innerWidth,
                height: window.innerHeight
            };
            const margin = 16; // Требуемый отступ от края экрана

            let pos = {
                // По умолчанию, располагаем по центру над элементом
                top: wrapperRect.top - tooltipRect.height - 8,
                left: wrapperRect.left + (wrapperRect.width / 2) - (tooltipRect.width / 2)
            };

            // Проверка и корректировка по вертикали
            // Если не помещается сверху, ставим снизу
            if (pos.top < margin) {
                pos.top = wrapperRect.bottom + 8;
            }

            // Проверка и корректировка по горизонтали
            if (pos.left < margin) {
                pos.left = margin;
            } else if (pos.left + tooltipRect.width > viewport.width - margin) {
                pos.left = viewport.width - tooltipRect.width - margin;
            }

            setPosition(pos);
        }
    }, [isVisible, text]); // Пересчитываем позицию, если изменился текст (и, возможно, размер)

    // Этот эффект отвечает за закрытие tooltip при клике вне его области
    useEffect(() => {
        if (!isTouchDeviceRef.current || !isVisible) return;

        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible]);

    const handleMouseEnter = () => {
        if (!isTouchDeviceRef.current) setIsVisible(true);
    };

    const handleMouseLeave = () => {
        if (!isTouchDeviceRef.current) setIsVisible(false);
    };

    const handleClick = (e) => {
        if (isTouchDeviceRef.current) {
            e.stopPropagation(); // Предотвращаем немедленное закрытие через listener на документе
            setIsVisible(prev => !prev);
        }
    };

    const tooltipVisibilityClasses = isVisible
        ? 'opacity-100'
        : 'opacity-0 pointer-events-none';

    return (
        <div 
            ref={wrapperRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            {children}
            <div 
                ref={tooltipRef}
                className={`
                    fixed w-max max-w-xs
                    bg-gray-800 text-white text-xs rounded-sm 
                    py-1 px-2 transition-opacity duration-300
                    shadow-lg border border-gray-700
                    z-[9999]
                    ${tooltipVisibilityClasses}
                `}
                style={{ top: `${position.top}px`, left: `${position.left}px` }}
            >
                <div dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br />') }} />
            </div>
        </div>
    );
};

export default Tooltip;