import React, { useState } from 'react';
import { GAME_TYPES } from '/models/questions';
import { Player } from '/models/player';
import { Meteor } from 'meteor/meteor';
import { TimingConfiguration } from '/models/timingConfiguration';

interface QuestionVotingProps {
    player: Player,
    timingConfiguration: TimingConfiguration,
}

export const QuestionVoting = (props: QuestionVotingProps) => {
  const [timer, setTimer] = useState(() => {
    return props.timingConfiguration.categoryVotingTimer;
  });

  React.useEffect(() => {
    timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
    if (timer === 0) {
      if (props.player.isHost) {
        Meteor.call("game.moveToQuestionDisplay", props.player.room, "Question Voting");
      }
    }
  }, [timer]);

  function voteOnGameType(gameType: string) {
    Meteor.call("game.voteOnQuestion", gameType, props.player);
  }
  
  return <div className="flex flex-column">
    <p>Pick a category</p>
    <select className="select" onChange={(e) => {
      let { value } = e.target
        voteOnGameType(value as string);
    }}>
    <option value="Random" key="random">Random</option>
    {
      GAME_TYPES.filter((gameType) => gameType !== "None").map(gameType => <option key={gameType} value={gameType}>{ gameType }</option>)
    }
    </select>
    <p className="timer">{ timer }</p>
  </div>
};
