// src/context/GameContext.jsx
import React, { createContext, useContext } from 'react';
import { useGameState } from '../hooks/useGameState';

// Создаем контекст, который будет хранить все данные и функции нашего игрового хука
const GameStateContext = createContext(null);

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

/**
 * Кастомный хук для легкого доступа к состоянию и хэндлерам в любом компоненте.
 * Вместо того чтобы передавать props, компоненты будут вызывать `useGame()`.
 */
export const useGame = () => {
    const context = useContext(GameStateContext);
    if (!context) {
        throw new Error('useGame должен использоваться внутри GameProvider');
    }
    return context;
};