// src/components/ui/display/Tooltip.jsx
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

const Tooltip = ({ text, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    
    const wrapperRef = useRef(null);
    const tooltipRef = useRef(null);
    
    const isTouchDeviceRef = useRef(
        typeof window !== 'undefined' && 
        ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    );

    useLayoutEffect(() => {
        if (isVisible && wrapperRef.current && tooltipRef.current) {
            const wrapperRect = wrapperRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const viewport = {
                width: window.innerWidth,
                height: window.innerHeight
            };
            const margin = 16; 

            let pos = {
                top: wrapperRect.top - tooltipRect.height - 8,
                left: wrapperRect.left + (wrapperRect.width / 2) - (tooltipRect.width / 2)
            };

            if (pos.top < margin) {
                pos.top = wrapperRect.bottom + 8;
            }

            if (pos.left < margin) {
                pos.left = margin;
            } else if (pos.left + tooltipRect.width > viewport.width - margin) {
                pos.left = viewport.width - tooltipRect.width - margin;
            }

            setPosition(pos);
        }
    }, [isVisible, text, children]); 

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
            e.stopPropagation();
            setIsVisible(prev => !prev);
        }
    };

    const tooltipVisibilityClasses = isVisible
        ? 'opacity-100'
        : 'opacity-0 pointer-events-none';

    // Рендерим содержимое в зависимости от типа пропа 'text'
    const renderTooltipContent = () => {
        if (typeof text === 'string') {
            return <div dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br />') }} />;
        }
        // Если 'text' - это JSX или массив JSX, просто рендерим его
        return text;
    };

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
                {renderTooltipContent()}
            </div>
        </div>
    );
};

export default Tooltip;