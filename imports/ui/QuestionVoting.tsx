import React, { useState } from 'react';
import { GAME_TYPES, GameType } from '/models/questions';
import { Player } from '/models/player';
import { Meteor } from 'meteor/meteor';
import { CATEGORY_VOTING_TIMER } from '/models/constants';

interface QuestionVotingProps {
    player: Player,
}

export const QuestionVoting = (props: QuestionVotingProps) => {
  const [timer, setTimer] = useState(() => {
    return CATEGORY_VOTING_TIMER;
  });

  React.useEffect(() => {
    timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
    if (timer === 0) {
      if (props.player.isHost) {
        Meteor.call("game.moveToQuestionDisplay", props.player.room, "Question Voting");
      }
    }
  }, [timer]);

  function voteOnGameType(gameType: GameType) {
    Meteor.call("game.voteOnQuestion", gameType, props.player);
  }
  
  return <div className="flex flex-column">
    <p>Pick a category</p>
    <select className="select" onChange={(e) => {
      let { value } = e.target
        voteOnGameType(value as GameType);
    }}>
    {
      GAME_TYPES.filter((gameType) => gameType !== "None").map(gameType => <option key={gameType} value={gameType}>{ gameType }</option>)
    }
    </select>
    <p className="timer">{ timer }</p>
  </div>
};
