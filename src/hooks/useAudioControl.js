import { useState, useEffect, useCallback, useRef } from 'react';
import { audioController } from '../utils/audioController';

export function useAudioControl(initialSfxVolume, initialMusicVolume) {
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const audioInitializedRef = useRef(false);

    const handleUserGesture = useCallback(() => {
        if (!audioInitializedRef.current) {
            const initPromise = audioController.init();
            if (initPromise instanceof Promise) {
                initPromise.then(() => {
                    audioController.setSfxVolume(initialSfxVolume);
                    audioController.setMusicVolume(initialMusicVolume);
                }).catch(e => console.error("Audio initialization failed:", e));
            }
            audioInitializedRef.current = true;
            setHasUserInteracted(true);
            window.removeEventListener('click', handleUserGesture);
            window.removeEventListener('keydown', handleUserGesture);
            window.removeEventListener('touchstart', handleUserGesture);
        }
    }, [initialSfxVolume, initialMusicVolume]);

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

    return { handleInitialGesture: handleUserGesture };
}