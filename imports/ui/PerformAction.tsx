import React, { useState } from 'react';
import { GameType } from '/models/questions';
import { Player } from '/models/player';
import { Meteor } from 'meteor/meteor';
import { TimingConfiguration } from '/models/timingConfiguration';

interface PerformActionProps {
    player: Player,
    category: GameType,
    round: number,
    timingConfiguration: TimingConfiguration,
}

export const PerformAction = (props: PerformActionProps) => {
  const [timer, setTimer] = useState(() => {
    return props.timingConfiguration.actionTimer;
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
      <div className="roundInformation">
        <p>{ props.category }</p>
        <p>-Round { props.round }-</p>
      </div>
      <p className="mainInstruction">3... 2... 1... Go!</p>
      <p className="timer">{ timer }</p>
    </div>
  )
};
