// src/App.jsx
import React from 'react';
import Game from './Game';

function App() {
  // Теперь здесь нет провайдера, так как он находится на уровень выше
  return (
    <Game />
  );
}

export default App;