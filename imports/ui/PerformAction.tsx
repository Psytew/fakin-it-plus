import React, { useState } from 'react';
import { GameType } from '/models/questions';
import { ACTION_TIMER } from '../../models/constants';
import { Player } from '/models/player';
import { Meteor } from 'meteor/meteor';

interface PerformActionProps {
    player: Player,
    category: GameType,
    round: number,
}

export const PerformAction = (props: PerformActionProps) => {
  const [timer, setTimer] = useState(() => {
    return ACTION_TIMER;
  });

  React.useEffect(() => {
    timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
    if (timer === 0) {
      if (props.player.isHost) {
        Meteor.call("game.changeGameState", props.player.room, "Faker Voting");
      }
    }
  }, [timer]);

  return (
    <div>
      <p>Category: { props.category }</p>
      <p>Round { props.round }</p>
      <p>Go!</p>
      <p className="timer">{ timer }</p>
    </div>
  )
};
