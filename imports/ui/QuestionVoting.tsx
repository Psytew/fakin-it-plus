import React, { useState } from 'react';
import { GAME_TYPES } from '/models/questions';
import { Player } from '/models/player';
import { Meteor } from 'meteor/meteor';
import { TimingConfiguration } from '/models/timingConfiguration';

interface QuestionVotingProps {
    player: Player,
    players: Player[],
    timingConfiguration: TimingConfiguration,
    readyVotes: number,
}

export const QuestionVoting = (props: QuestionVotingProps) => {
  const [timer, setTimer] = useState(() => {
    return props.timingConfiguration.categoryVotingTimer;
  });
  const [ready, setReady] = useState(false);

  if (props.player.isHost && props.readyVotes === props.players.length) {
    moveOnToNextRound();
  }

  React.useEffect(() => {
    timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
    if (timer === 0) {
      if (props.player.isHost) {
        moveOnToNextRound();
      }
    }
  }, [timer]);

  function voteOnGameType(gameType: string) {
    Meteor.call("game.voteOnQuestion", gameType, props.player);
  }

  function moveOnToNextRound() {
    const rand1 = Math.floor(Math.random() * props.players.length);
      const rand2 = Math.floor(Math.random() * 6);
      const rand3 = Math.floor(Math.random() * props.players.length);
      Meteor.call("game.moveToQuestionDisplay", props.player.room, rand1, rand2, rand3);
  }

  function isReady() {
    setReady(true);
    Meteor.call("game.lockInVote", props.player.room);
  }
  
  return <div className="flex flex-column">
    <p className="mainInstruction">Pick a category</p>
    <select className="select" onChange={(e) => {
      let { value } = e.target
        voteOnGameType(value as string);
    }}>
    <option value="Random" key="random">Random</option>
    {
      GAME_TYPES.filter((gameType) => gameType !== "None").map(gameType => <option key={gameType} value={gameType}>{ gameType }</option>)
    }
    </select>
    <div className="flex flex-column">
      <p>
        <button disabled={ready} onClick={() => isReady()}>{ ready ? "Ready" : "Ready?" }</button>
      </p>
    </div>
    <p className="timer">{ timer }</p>
  </div>
};
