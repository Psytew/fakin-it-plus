import React, { FormEvent, useState } from 'react';
import { GameState } from '/models/gameState';
import { Initial } from './Initial';
import { Player } from '/models/player';
import { generateQuestionBank } from '/utils/generateQuestionBank';
import { Waiting } from './Waiting';
import { EnterName } from './EnterName';
import { DUMMY_PLAYERS } from '/models/dummyPlayers';

export const App = () => {

  const moveToNameNew = () => {
    setGameState('Enter Name New');
  };

  const moveToNameExisting = () => {
    setGameState('Enter Name Existing');
  };

  const [playerNameInput, setPlayerNameInput] = useState("");
  const [roomInput, setRoomInput] = useState("");

  const [room, setRoom] = useState("");
  const [player, setPlayer] = useState(null as Player | null);
  const [gameState, setGameState] = useState('Initial' as GameState)
  const [players, setPlayers] = useState([] as Player[])
    
  const handleNameSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(roomInput);
    console.log(gameState);

    if (!playerNameInput) return;
    if (!roomInput && gameState === 'Enter Name Existing') {
      return;
    }

    const player = {
      name: playerNameInput,
      room: 'WEST',
      isHost: true,
      questionBank: generateQuestionBank()
    }
    setPlayer(player);

    if (gameState === 'Enter Name New') {
      setRoom('ABCD');
    } else {
      setRoom(roomInput);
    }

    const dummyPlayers = DUMMY_PLAYERS;
    for (const player of dummyPlayers) {
      player.room = room;
    }

    setPlayers([player].concat(dummyPlayers));
    setGameState('Waiting');
  };

  function returnStateComponent(state: GameState) {
    if (state === 'Initial') {
      return <Initial
        moveToNameExisting={moveToNameExisting}
        moveToNameNew={moveToNameNew}
      ></Initial>
    } else if (state === 'Enter Name Existing' || state === 'Enter Name New') {
      const isNewGame = state === 'Enter Name New';
      return <EnterName isNewGame={isNewGame} handleNameSubmit={handleNameSubmit} setPlayerName={setPlayerNameInput} setRoomInput={setRoomInput}></EnterName>
    } else if (state === 'Waiting') {
      return <Waiting players={players} room={room}></Waiting>
    }
    return '';
  }

  return <div>
    <h1>Fakin' It Plus</h1>
    { returnStateComponent(gameState) }
  </div>
};
