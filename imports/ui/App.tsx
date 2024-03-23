import React, { FormEvent, useState } from 'react';
import { GameState } from '/models/gameState';
import { Initial } from './Initial';
import { Player } from '/models/player';
import { Waiting } from './Waiting';
import { EnterName } from './EnterName';
import { DUMMY_PLAYERS } from '/models/dummyPlayers';
import { QuestionVoting } from './QuestionVoting';
import { GameType, Question } from '/models/questions';
import { QuestionDisplay } from './QuestionDisplay';
import { PerformAction } from './PerformAction';
import { FakerVoting } from './FakerVoting';
import { Results } from './Results';

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

  const continueToPerformAction = () => {
    setGameState('Perform Action');
  }

  const continueToFakerVoting = () => {
    setGameState('Faker Voting');
  }

  const continueToResults = () => {
    const correct = fakerVote === faker;
    setCorrectGuess(correct);
    if (correct && !isFaker || !correct && isFaker) {
      const newPoints = player!.points + 1;
      player!.points = newPoints;
      setPlayer(player);
    }
    setGameState('Results');
  }

  const continueAfterResults = (correct: boolean) => {
    if (correct) {
      initializeWaitingRoom();
    } else {
      setRound(round + 1);
      setGameState('Question Display');
    }
  }

  const [playerNameInput, setPlayerNameInput] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const [categoryVoteInput, setCategoryVoteInput] = useState("You Gotta Point" as GameType);
  const [fakerVote, setFakerVote] = useState('');

  const [room, setRoom] = useState("");
  const [player, setPlayer] = useState(null as Player | null);
  const [gameState, setGameState] = useState('Initial' as GameState);
  const [players, setPlayers] = useState([] as Player[]);
  const [category, setCategory] = useState("None" as GameType);
  const [question, setQuestion] = useState("PLACEHOLDER" as Question | 'PLACEHOLDER');
  const [isFaker, setIsFaker] = useState(false);
  const [faker, setFaker] = useState('');
  const [round, setRound] = useState(1);
  const [correctGuess, setCorrectGuess] = useState(false);
    
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
      points: 0,
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
    initializeWaitingRoom()
  };

  function initializeWaitingRoom() {
    setRound(1);
    setCategory('None');
    setGameState('Waiting');
  }

  const handleCategoryVote = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setCategory(categoryVoteInput);

    // ACTUALLY RANDOMIZE THIS PER PLAYER; look at this
    const isFaker = 0.5 > Math.random();
    setIsFaker(isFaker);
    console.log(isFaker);
    if (isFaker) {
      console.log('setting to patrick');
      setFaker(player!.name);
    } else {
      console.log('setting to kris');
      setFaker('Kris');
    }

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
      return <QuestionDisplay category={category} player={player!} isFaker={isFaker} setQuestion={setQuestion} continueToPerformAction={continueToPerformAction}></QuestionDisplay>
    } else if (state === 'Perform Action') {
      return <PerformAction category={category} continueToFakerVoting={continueToFakerVoting}></PerformAction>
    } else if (state === 'Faker Voting') {
      return <FakerVoting players={players} setFakerVote={setFakerVote} continueToResults={continueToResults}></FakerVoting>
    } else if (state === 'Results') {
      return <Results correct={correctGuess} continueAfterResults={continueAfterResults}></Results>
    }
    return '';
  }

  let classValue = 'background';

  if (category === 'You Gotta Point') {
    classValue = 'background youGottaPoint';
  } else if (category === 'Face Value') {
    classValue = 'background faceValue'
  } else if (category === 'Hands of Truth') {
    classValue = 'background handsOfTruth'
  } else if (category === 'Number Pressure') {
    classValue = 'background numberPressure'
  } else if (category === 'Impersifacions') {
    classValue = 'background impersifacions'
  } else if (category === 'This Much') {
    classValue = 'background thisMuch'
  }

  return <div className={classValue}><div className="container">
    <h1>Fakin' It Plus</h1>
    { returnStateComponent(gameState) }
  </div></div>
};
