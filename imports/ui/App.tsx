import React, { useState } from 'react';
import { GameState } from '/models/gameState';
import { Initial } from './Initial';
import { Player } from '/models/player';
import { generateQuestionBank } from '/utils/generateQuestionBank';
import { Waiting } from './Waiting';
import { EnterName } from './EnterName';

let gameState: GameState = 'Initial';
const players: Player[] = []

const moveToNameNew = () => {
  gameState = 'Enter Name New';
};

const moveToNameExisting = () => {
  gameState = 'Enter Name Existing';
};
  
const handleNameSubmit = e => {
  e.preventDefault();

  if (!text) return;

  players.push({
    name: 'Patrick',
    room: 'WEST',
    isHost: true,
    questionBank: generateQuestionBank()
  })
};

function returnStateComponent(state: GameState) {
  if (state === 'Initial') {
    return <Initial
      moveToNameExisting={moveToNameExisting}
      moveToNameNew={moveToNameNew}
    ></Initial>
  } else if (state === 'Enter Name Existing' || state === 'Enter Name New') {
    const isNewGame = state === 'Enter Name New';
    return <EnterName isNewGame={isNewGame} handleNameSubmit={handleNameSubmit}></EnterName>
  } else if (state === 'Waiting') {
    return <Waiting players={players}></Waiting>
  }
  return '';
}

export const App = () => {
  const [text] = useState("");

  return <div>
    <h1>Fakin' It Plus</h1>
    { returnStateComponent(gameState) }
  </div>
};
