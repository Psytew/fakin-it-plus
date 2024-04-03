import React, { useState } from 'react';
import { MAX_ROUNDS_1, MAX_ROUNDS_2, MAX_ROUNDS_CUTOFF } from '../../models/constants';
import { Player } from '/models/player';
import { Meteor } from 'meteor/meteor';
import { GameType } from '/models/questions';
import { TimingConfiguration } from '/models/timingConfiguration';

interface ResultsProps {
    correct: boolean,
    players: Player[],
    player: Player,
    round: number,
    faker: string,
    category: GameType,
    timingConfiguration: TimingConfiguration,
    readyVotes: number,
}

export const Results = (props: ResultsProps) => {
  const isOver = props.round >= (props.players.length >= MAX_ROUNDS_CUTOFF ? MAX_ROUNDS_2 : MAX_ROUNDS_1);

  const [timer, setTimer] = useState(() => {
    return props.timingConfiguration.resultsTimer;
  });
  const [ready, setReady] = useState(false);
  
  if (props.player.isHost && props.readyVotes === props.players.length) {
      moveOn();
  }

  React.useEffect(() => {
    timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
    if (timer === 0) {
        if (props.player.isHost) {
          moveOn();
        }
    }
}, [timer]);

  function moveOn() {
    if (props.correct || isOver) {
      Meteor.call("game.returnToWaitingRoom", props.player.room);
    } else {
      Meteor.call("game.continueWithRound", props.player.room);
    }
  }
  
  function isReady() {
    setReady(true);
    Meteor.call("game.lockInVote", props.player.room);
  }

  if (isOver) {
    return <>
      <div className="roundInformation">
        <p>{ props.category }</p>
        <p>-Round { props.round }-</p>
      </div>
      <p className="mainInstruction">Looks like the faker, { props.faker }, won this round!</p>
      <div className="flex flex-column">
          <p>
              <button disabled={ready} onClick={() => isReady()}>{ ready ? "Ready" : "Ready?" }</button>
          </p>
      </div>
      <p className="timer">{ timer }</p>
    </>
  }
  if (props.correct && props.player.name !== props.faker) {
    return <>
      <div className="roundInformation">
        <p>{ props.category }</p>
        <p>-Round { props.round }-</p>
      </div>
      <p className="mainInstruction">You're correct, the faker was { props.faker } all along!</p>
      <div className="flex flex-column">
          <p>
              <button disabled={ready} onClick={() => isReady()}>{ ready ? "Ready" : "Ready?" }</button>
          </p>
      </div>
      <p className="timer">{ timer }</p>
    </>
  } else if (props.correct) {
    return <>
      <div className="roundInformation">
        <p>{ props.category }</p>
        <p>-Round { props.round }-</p>
      </div>
      <p className="mainInstruction">Sorry faker, you've been caught!</p>
      <div className="flex flex-column">
          <p>
              <button disabled={ready} onClick={() => isReady()}>{ ready ? "Ready" : "Ready?" }</button>
          </p>
      </div>
      <p className="timer">{ timer }</p>
    </>
  } else if (!props.correct && props.player.name !== props.faker) {
    return <>
      <div className="roundInformation">
        <p>{ props.category }</p>
        <p>-Round { props.round }-</p>
      </div>
      <p className="mainInstruction">You failed to find the faker! Get ready to try again!</p>
      <div className="flex flex-column">
          <p>
              <button disabled={ready} onClick={() => isReady()}>{ ready ? "Ready" : "Ready?" }</button>
          </p>
      </div>
      <p className="timer">{ timer }</p>
    </>
  } else {
    return <>
      <div className="roundInformation">
        <p>{ props.category }</p>
        <p>-Round { props.round }-</p>
      </div>
      <p className="mainInstruction">Nice job fakin it! Get ready to do it again!</p>
      <div className="flex flex-column">
          <p>
              <button disabled={ready} onClick={() => isReady()}>{ ready ? "Ready" : "Ready?" }</button>
          </p>
      </div>
      <p className="timer">{ timer }</p>
    </>
  }
};
