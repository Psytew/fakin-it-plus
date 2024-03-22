import React, { FormEvent, useState } from 'react';
import { GameState } from '/models/gameState';
import { Initial } from './Initial';
import { Player } from '/models/player';
import { generateQuestionBank } from '/utils/generateQuestionBank';
import { Waiting } from './Waiting';
import { EnterName } from './EnterName';
import { DUMMY_PLAYERS } from '/models/dummyPlayers';
import { QuestionVoting } from './QuestionVoting';
import { GameType, Question } from '/models/questions';
import { QuestionDisplay } from './QuestionDisplay';

export const App = () => {

  const moveToNameNew = () => {
    setGameState('Enter Name New');
  };

  const moveToNameExisting = () => {
    setGameState('Enter Name Existing');
  };

  const startGame = () => {
    setGameState('Question Voting');
  }

  const [playerNameInput, setPlayerNameInput] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const [categoryVoteInput, setCategoryVoteInput] = useState("You Gotta Point" as GameType);

  const [room, setRoom] = useState("");
  const [player, setPlayer] = useState(null as Player | null);
  const [gameState, setGameState] = useState('Initial' as GameState);
  const [players, setPlayers] = useState([] as Player[]);
  const [category, setCategory] = useState("None" as GameType);
  const [question, setQuestion] = useState("PLACEHOLDER" as Question | 'PLACEHOLDER');
  const [isFaker, setIsFaker] = useState(false);
    
  const handleNameSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!playerNameInput) return;
    if (!roomInput && gameState === 'Enter Name Existing') {
      return;
    }

    const player = {
      name: playerNameInput,
      room: 'WEST',
      isHost: true,
      isFaker: false,
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

  const handleCategoryVote = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setCategory(categoryVoteInput);

    // ACTUALLY RANDOMIZE THIS PER PLAYER
    setIsFaker(Math.random() > 0.5);

    setGameState('Question Display');
  }

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
      return <Waiting players={players} room={room} startGame={startGame}></Waiting>
    } else if (state === 'Question Voting') {
      return <QuestionVoting handleCategoryVote={handleCategoryVote} setCategoryVoteInput={setCategoryVoteInput}></QuestionVoting>
    } else if (state === 'Question Display') {
      return <QuestionDisplay category={category} player={player!} isFaker={isFaker} setQuestion={setQuestion}></QuestionDisplay>
    }
    return '';
  }

  return <div>
    <h1>Fakin' It Plus</h1>
    { returnStateComponent(gameState) }
  </div>
};
