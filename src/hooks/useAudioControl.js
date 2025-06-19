import { useState, useEffect, useCallback, useRef } from 'react';
import { audioController } from '../utils/audioController';

// Хук для управления инициализацией и воспроизведением аудио
export function useAudioControl(initialSfxVolume, initialMusicVolume) {
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const audioInitializedRef = useRef(false);

    // Обработчик для инициализации Tone.js после первого взаимодействия с документом
    const handleUserGesture = useCallback(() => {
        if (!audioInitializedRef.current) {
            const initPromise = audioController.init();
            if (initPromise instanceof Promise) {
                initPromise.then(() => {
                    // Устанавливаем начальную громкость после инициализации аудиоконтекста
                    audioController.setSfxVolume(initialSfxVolume);
                    audioController.setMusicVolume(initialMusicVolume);
                }).catch(e => console.error("Audio initialization failed:", e));
            }
            audioInitializedRef.current = true;
            setHasUserInteracted(true); // Устанавливаем флаг взаимодействия
            // Удаляем слушатели после первого взаимодействия
            window.removeEventListener('click', handleUserGesture);
            window.removeEventListener('keydown', handleUserGesture);
            window.removeEventListener('touchstart', handleUserGesture);
        }
    }, [initialSfxVolume, initialMusicVolume]); // Зависимости для useCallback

    // Добавляем слушатели событий для инициализации аудио
    useEffect(() => {
        if (!hasUserInteracted) {
            window.addEventListener('click', handleUserGesture);
            window.addEventListener('keydown', handleUserGesture);
            window.addEventListener('touchstart', handleUserGesture);
        }
        return () => {
            window.removeEventListener('click', handleUserGesture);
            window.removeEventListener('keydown', handleUserGesture);
            window.removeEventListener('touchstart', handleUserGesture);
        };
    }, [hasUserInteracted, handleUserGesture]);

    return { handleInitialGesture: handleUserGesture }; // Возвращаем функцию, которую нужно вызвать при первом клике на App
}