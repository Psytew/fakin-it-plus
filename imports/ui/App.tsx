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
import { TimingConfiguration } from '/models/timingConfiguration';

export const App = () => {

  const moveToNameNew = () => {
    setGameState('Enter Name New');
  };

  const moveToNameExisting = () => {
    setGameState('Enter Name Existing');
  };

  const [playerNameInput, setPlayerNameInput] = useState("");
  const [roomInput, setRoomInput] = useState("");

  const [code, setCode] = useState("");
  const [player, setPlayer] = useState(null as Player | null);
  const [gameState, setGameState] = useState('Initial' as GameState);
  const [players, setPlayers] = useState([] as Player[]);
  const [category, setCategory] = useState("None" as GameType);
  const [question, setQuestion] = useState("PLACEHOLDER" as Question | 'PLACEHOLDER');
  const [round, setRound] = useState(1);
  const [correct, setCorrect] = useState(false);
  const [faker, setFaker] = useState('');
  const [fakerVotes, setFakerVotes] = useState({});
  const [timingConfiguration, setTimingConfiguration] = useState(null as TimingConfiguration | null);
    
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

    setCode(myGameSnapshot.code);
    setPlayers(myGameSnapshot.players);
    setPlayer(myGameSnapshot.players.find((snapshotPlayer: Player) => snapshotPlayer.userId === newPlayer.userId));
    setTimingConfiguration(myGameSnapshot.timingConfiguration);
    initializeWaitingRoom();

    window.addEventListener('beforeunload', function () {
      Meteor.call("game.disconnect", newPlayer.userId, code);
    }, false);

    MyGame.observeChanges({
      changed: function (_id: string, fields: Record<string, unknown>) {
        if (fields.players !== undefined) {
          setPlayers(fields.players as Player[]);
          const updatedPlayer = (fields.players as Player[]).filter((p) => p.userId === newPlayer.userId)[0];
          setPlayer(updatedPlayer);
        }
        if (fields.gameState !== undefined) {
          setGameState(fields.gameState as GameState);
        }
        if (fields.question !== undefined) {
          setQuestion(fields.question as Question);
        }
        if (fields.gameType !== undefined) {
          setCategory(fields.gameType as GameType)
        }
        if (fields.faker !== undefined) {
          setFaker(fields.faker as string)
        }
        if (fields.fakerVotes !== undefined) {
          setFakerVotes(fields.fakerVotes as Record<string, string>)
        }
        if (fields.correct !== undefined) {
          setCorrect(fields.correct as boolean)
        }
        if (fields.round !== undefined) {
          setRound(fields.round as number);
        }
        if (fields.timingConfiguration !== undefined) {
          console.log(fields.timingConfiguration);
          setTimingConfiguration(fields.timingConfiguration as TimingConfiguration);
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
      return <Waiting timingConfiguration={timingConfiguration!} players={players} player={player!} room={code}></Waiting>
    } else if (state === 'Question Voting') {
      return <QuestionVoting timingConfiguration={timingConfiguration!} player={player!}></QuestionVoting>
    } else if (state === 'Question Display') {
      return <QuestionDisplay timingConfiguration={timingConfiguration!} category={category} player={player!} faker={faker} question={question} round={round}></QuestionDisplay>
    } else if (state === 'Perform Action') {
      return <PerformAction timingConfiguration={timingConfiguration!} category={category} player={player!} round={round}></PerformAction>
    } else if (state === 'Faker Voting') {
      return <FakerVoting timingConfiguration={timingConfiguration!} players={players} player={player!} fakerVotes={fakerVotes} round={round} category={category} question={question} faker={faker}></FakerVoting>
    } else if (state === 'Results') {
      return <Results timingConfiguration={timingConfiguration!} player={player!} players={players} round={round} faker={faker} correct={correct} category={category}></Results>
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
