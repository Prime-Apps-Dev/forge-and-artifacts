// src/context/GameContext.jsx
import React, { createContext } from 'react';
import { useGameState } from '../hooks/useGameState';

// Экспортируем контекст для использования в кастомном хуке
export const GameStateContext = createContext(null);

/**
 * Провайдер состояния игры. Этот компонент оборачивает всё приложение
 * и предоставляет доступ к игровому состоянию через контекст.
 */
export const GameProvider = ({ children }) => {
    // Вся сложная логика состояния инкапсулирована здесь
    const gameStateHook = useGameState();

    return (
        <GameStateContext.Provider value={gameStateHook}>
            {children}
        </GameStateContext.Provider>
    );
};