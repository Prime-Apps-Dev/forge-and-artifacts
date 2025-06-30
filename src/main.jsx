// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GameProvider } from './context/GameContext'; // Импортируем наш провайдер

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // Оборачиваем App в GameProvider, чтобы контекст был доступен всему приложению
    <GameProvider>
      <App />
    </GameProvider>
);