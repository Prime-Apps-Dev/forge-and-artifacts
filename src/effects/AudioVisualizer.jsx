// src/components/effects/AudioVisualizer.jsx

import React, { useRef, useEffect, useState } from 'react';
import { audioController } from "../../utils/audioController";

const AudioVisualizer = () => {
    const canvasRef = useRef(null);
    const animationFrameId = useRef(null);
    const [gradientColor, setGradientColor] = useState('rgba(121, 68, 2, 0.2)'); // Базовый цвет градиента

    // Функция для отрисовки на Canvas
    const draw = (context, canvas) => {
        const volume = audioController.getVolume(); // Получаем громкость (от -100 до 0)
        const normalizedVolume = Math.max(0, Math.min(1, (volume + 40) / 40)); // Нормализуем от -40dB до 0dB в 0-1

        context.clearRect(0, 0, canvas.width, canvas.height); // Очищаем канвас

        // Динамическое изменение градиента на основе громкости
        // Будем использовать радиальный градиент, который реагирует на громкость
        const radius = Math.max(canvas.width, canvas.height) * (0.5 + normalizedVolume * 0.2); // Увеличиваем радиус с громкостью
        const alpha = 0.2 + normalizedVolume * 0.4; // Увеличиваем прозрачность с громкостью (от 0.2 до 0.6)

        // Центр градиентов (можно сделать динамическим, но для простоты пока статичен)
        const centerX1 = canvas.width * 0.8;
        const centerY1 = canvas.height * 0.2;
        const centerX2 = canvas.width * 0.2;
        const centerY2 = canvas.height * 0.8;

        const gradient1 = context.createRadialGradient(centerX1, centerY1, 0, centerX1, centerY1, radius);
        gradient1.addColorStop(0, `rgba(121, 68, 2, ${alpha})`); // Цвет 1
        gradient1.addColorStop(1, 'transparent');
        context.fillStyle = gradient1;
        context.fillRect(0, 0, canvas.width, canvas.height);

        const gradient2 = context.createRadialGradient(centerX2, centerY2, 0, centerX2, centerY2, radius);
        gradient2.addColorStop(0, `rgba(50, 23, 77, ${alpha})`); // Цвет 2
        gradient2.addColorStop(1, 'transparent');
        context.fillStyle = gradient2;
        context.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Основной цикл анимации
    const animate = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        // Устанавливаем размеры канваса, чтобы он соответствовал родительскому элементу
        // И предотвращаем размытие на HiDPI экранах
        const dpr = window.devicePixelRatio || 1;
        if (canvas.width !== canvas.offsetWidth * dpr || canvas.height !== canvas.offsetHeight * dpr) {
            canvas.width = canvas.offsetWidth * dpr;
            canvas.height = canvas.offsetHeight * dpr;
            context.scale(dpr, dpr);
        }

        draw(context, canvas);
        animationFrameId.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        // Убедимся, что аудио инициализировано перед запуском визуализатора
        if (!audioController.isInitialized) {
            const checkAudioInterval = setInterval(() => {
                if (audioController.isInitialized) {
                    clearInterval(checkAudioInterval);
                    animationFrameId.current = requestAnimationFrame(animate);
                }
            }, 500);
            return () => clearInterval(checkAudioInterval);
        } else {
            animationFrameId.current = requestAnimationFrame(animate);
        }

        return () => {
            cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full z-0"
            style={{ pointerEvents: 'none' }}
        ></canvas>
    );
};

export default AudioVisualizer;