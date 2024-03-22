import React from 'react';
import { GameState } from '/models/gameState';
import { Initial } from './Initial';

const gameState: GameState = 'Initial';

function returnStateComponent(state: GameState) {
  if (state === 'Initial') {
    return <Initial></Initial>
  }
  return '';
}

export const App = () => (
  <div>
    <h1>Fakin' It Plus</h1>
    { returnStateComponent(gameState) }
  </div>
);
