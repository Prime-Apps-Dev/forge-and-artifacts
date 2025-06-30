// src/App.jsx
import React from 'react';
import { GameProvider } from './context/GameContext';
import Game from './Game'; // Импортируем наш новый основной компонент

// App теперь отвечает только за предоставление контекста
function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}

export default App;