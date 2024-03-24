import React, { FormEvent, useState } from 'react';
import { GameState } from '/models/gameState';
import { Initial } from './Initial';
import { Player } from '/models/player';
import { Waiting } from './Waiting';
import { EnterName } from './EnterName';
import { QuestionVoting } from './QuestionVoting';
import { GameType, Question } from '/models/questions';
import { QuestionDisplay } from './QuestionDisplay';
import { PerformAction } from './PerformAction';
import { FakerVoting } from './FakerVoting';
import { Results } from './Results';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Games } from '../api/games';

export const App = () => {

  const moveToNameNew = () => {
    setGameState('Enter Name New');
  };

  const moveToNameExisting = () => {
    setGameState('Enter Name Existing');
  };

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

  const [room, setRoom] = useState("");
  const [player, setPlayer] = useState(null as Player | null);
  const [gameState, setGameState] = useState('Initial' as GameState);
  const [players, setPlayers] = useState([] as Player[]);
  const [category, setCategory] = useState("None" as GameType);
  const [question, setQuestion] = useState("PLACEHOLDER" as Question | 'PLACEHOLDER');
  const [round, setRound] = useState(1);
  const [correctGuess] = useState(false);
  const [faker, setFaker] = useState('');
    
  const handleNameSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!playerNameInput) return;
    if (!roomInput && gameState === 'Enter Name Existing') {
      return;
    }

    const newPlayer = {
      name: playerNameInput,
      room: roomInput,
      isHost: gameState === 'Enter Name New',
      isFaker: false,
      points: 0,
      userId: Random.secret()
    }

    if (gameState === 'Enter Name New') {
      Meteor.call("games.new", newPlayer, (_error: unknown, result: string) => {
        if (result === "ERROR") {
          alert("Error creating room");
        } else {
          joinRoom(newPlayer, result);
        }
      });
    } else {
      Meteor.call("games.join", newPlayer, roomInput, (_error: unknown, result: string) => {
        if (result === "ERROR_ROOM_CODE") {
          alert("Error joining room. Are you sure you spelled the room code correctly?");
        } else if (result === "ERROR_ROOM_FULL") {
          alert("Sorry, this room is full.");
        } else if (result === "ERROR_NOT_WAITING") {
          alert("This room is actively in a round of gameplay.")
        } else {
          joinRoom(newPlayer, result);
        }
      })
    }
  };

  function joinRoom(newPlayer: Player, code: string) {
    Meteor.subscribe('MyGame');
    Session.set("inGame", true);

    const MyGame = Games.find({code});
    const myGameSnapshot = Games.findOne({ code })!;

    setRoom(myGameSnapshot.code);
    setPlayers(myGameSnapshot.players);
    setPlayer(myGameSnapshot.players.find((snapshotPlayer: Player) => snapshotPlayer.userId === newPlayer.userId));
    initializeWaitingRoom();

    MyGame.observeChanges({
      changed: function (_id: string, fields: Record<string, unknown>) {
        if (fields.players) {
          setPlayers(fields.players as Player[]);
        }
        if (fields.gameState) {
          setGameState(fields.gameState as GameState);
        }
        if (fields.question) {
          setQuestion(fields.question as Question);
        }
        if (fields.gameType) {
          setCategory(fields.gameType as GameType)
        }
        if (fields.faker) {
          setFaker(fields.faker as string)
        }
      },
    });
  }

  function initializeWaitingRoom() {
    setRound(1);
    setCategory('None');
    setGameState('Waiting');
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
      return <Waiting players={players} player={player!} room={room}></Waiting>
    } else if (state === 'Question Voting') {
      return <QuestionVoting player={player!}></QuestionVoting>
    } else if (state === 'Question Display') {
      return <QuestionDisplay category={category} player={player!} faker={faker} question={question}></QuestionDisplay>
    } else if (state === 'Perform Action') {
      return <PerformAction category={category} player={player!}></PerformAction>
    } else if (state === 'Faker Voting') {
      return <FakerVoting players={players} player={player!}></FakerVoting>
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
