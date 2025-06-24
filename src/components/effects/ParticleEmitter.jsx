// src/components/effects/ParticleEmitter.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { visualEffects } from '../../utils/visualEffects';

const Particle = ({ id, x, y, type, onAnimationEnd }) => {
    const [style, setStyle] = useState({});
    const timeoutRef = useRef(null);
    const animationFrameRef = useRef(null);
    const startTimeRef = useRef(Date.now());

    // Определение цветов и базовых свойств в зависимости от типа
    const getParticleProps = useCallback(() => {
        let colors = ['#FFD700', '#FFA500', '#4CAF50', '#64B5F6']; // Желтый, Оранжевый, Зеленый, Синий
        let size = 10;
        let lifetime = 1000; // ms
        let initialVelocity = { x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 200 }; // Случайная начальная скорость
        let gravityFactor = 0.5; // Фактор "гравитации"

        switch (type) {
            case 'levelup':
                colors = ['#FFD700', '#FFA500', '#FF4500', '#FF0000'];
                size = 15;
                lifetime = 1200;
                initialVelocity = { x: (Math.random() - 0.5) * 300, y: (Math.random() - 0.5) * 300 - 150 }; // Более сильный "выброс" вверх
                gravityFactor = 0.8;
                break;
            case 'shop_levelup':
                colors = ['#FFD700', '#FFECB3', '#FF9800'];
                size = 12;
                lifetime = 1000;
                initialVelocity = { x: (Math.random() - 0.5) * 250, y: (Math.random() - 0.5) * 250 - 100 };
                gravityFactor = 0.6;
                break;
            case 'workstation_levelup':
                colors = ['#FFD700', '#FFB300', '#FF6F00', '#607D8B'];
                size = 14;
                lifetime = 1100;
                initialVelocity = { x: (Math.random() - 0.5) * 280, y: (Math.random() - 0.5) * 280 - 120 };
                gravityFactor = 0.7;
                break;
            case 'success':
                colors = ['#8BC34A', '#CDDC39', '#4CAF50'];
                size = 10;
                lifetime = 800;
                initialVelocity = { x: (Math.random() - 0.5) * 150, y: (Math.random() - 0.5) * 150 - 50 };
                gravityFactor = 0.4;
                break;
            default: // Для общих кликов
                colors = ['#E0E0E0', '#BDBDBD', '#9E9E9E']; // Серый, светлее, темнее
                size = 8;
                lifetime = 600;
                initialVelocity = { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100 - 30 };
                gravityFactor = 0.3;
                break;
        }
        
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomSize = size + Math.random() * size * 0.5; // Размер от size до 1.5*size

        return {
            color: randomColor,
            size: randomSize,
            lifetime,
            initialVelocity,
            gravityFactor
        };
    }, [x, y, type]);

    useEffect(() => {
        const { color, size, lifetime, initialVelocity, gravityFactor } = getParticleProps();
        startTimeRef.current = Date.now();

        const animateParticle = () => {
            const elapsedTime = Date.now() - startTimeRef.current;
            const progress = elapsedTime / lifetime;

            if (progress >= 1) {
                onAnimationEnd(id);
                return;
            }

            const currentX = initialVelocity.x * (1 - progress); // Затухание скорости по X
            const currentY = initialVelocity.y * (1 - progress) + (gravityFactor * Math.pow(progress, 2) * 500); // Затухание скорости по Y + гравитация

            const opacity = 1 - progress;
            const currentSize = size * (1 - progress * 0.5); // Уменьшение размера

            setStyle({
                position: 'fixed',
                left: `${x}px`,
                top: `${y}px`,
                width: `${currentSize}px`,
                height: `${currentSize}px`,
                backgroundColor: color,
                borderRadius: '50%',
                opacity: opacity,
                transform: `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`, // Смещение относительно центра и движение
                zIndex: 99999,
                pointerEvents: 'none',
            });

            animationFrameRef.current = requestAnimationFrame(animateParticle);
        };

        animationFrameRef.current = requestAnimationFrame(animateParticle);

        timeoutRef.current = setTimeout(() => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            onAnimationEnd(id);
        }, lifetime);


        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [id, x, y, type, onAnimationEnd, getParticleProps]);

    return <div style={style} />;
};

const ParticleEmitter = () => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const unsubscribe = visualEffects.subscribe(newEffect => {
            setParticles(prev => [...prev, newEffect]);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleAnimationEnd = useCallback((id) => {
        setParticles(prev => prev.filter(p => p.id !== id));
    }, []);

    return (
        <div className="particle-emitter-container fixed inset-0 pointer-events-none z-[100000]">
            {particles.map(particle => (
                <Particle
                    key={particle.id}
                    id={particle.id}
                    x={particle.x}
                    y={particle.y}
                    type={particle.type}
                    onAnimationEnd={handleAnimationEnd}
                />
            ))}
        </div>
    );
};

export default ParticleEmitter;