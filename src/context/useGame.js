// src/context/useGame.js
import { useContext } from 'react';
import { GameStateContext } from './GameContext';

export const useGame = () => {
    const context = useContext(GameStateContext);
    if (!context) {
        throw new Error('useGame должен использоваться внутри GameProvider');
    }
    return context;
};