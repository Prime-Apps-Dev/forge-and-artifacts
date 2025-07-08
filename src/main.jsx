// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GameProvider } from './context/GameContext'; // <-- Импортируем провайдер

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GameProvider> {/* <== Оборачиваем App, как вы и указали */}
      <App />
    </GameProvider>
  </React.StrictMode>
);