// src/components/effects/AudioVisualizer.jsx
import React, { useRef, useEffect, useState } from 'react';
import { audioController } from '../../utils/audioController';

const AudioVisualizer = () => {
    const canvasRef = useRef(null);
    const animationFrameId = useRef(null);
    const [gradientColor, setGradientColor] = useState('rgba(121, 68, 2, 0.2)');

    const draw = (context, canvas) => {
        const volume = audioController.getVolume();
        const normalizedVolume = Math.max(0, Math.min(1, (volume + 40) / 40));

        context.clearRect(0, 0, canvas.width, canvas.height);

        const radius = Math.max(canvas.width, canvas.height) * (0.5 + normalizedVolume * 0.2);
        const alpha = 0.2 + normalizedVolume * 0.4;

        const centerX1 = canvas.width * 0.8;
        const centerY1 = canvas.height * 0.2;
        const centerX2 = canvas.width * 0.2;
        const centerY2 = canvas.height * 0.8;

        const gradient1 = context.createRadialGradient(centerX1, centerY1, 0, centerX1, centerY1, radius);
        gradient1.addColorStop(0, `rgba(121, 68, 2, ${alpha})`);
        gradient1.addColorStop(1, 'transparent');
        context.fillStyle = gradient1;
        context.fillRect(0, 0, canvas.width, canvas.height);

        const gradient2 = context.createRadialGradient(centerX2, centerY2, 0, centerX2, centerY2, radius);
        gradient2.addColorStop(0, `rgba(50, 23, 77, ${alpha})`);
        gradient2.addColorStop(1, 'transparent');
        context.fillStyle = gradient2;
        context.fillRect(0, 0, canvas.width, canvas.height);
    };

    const animate = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
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