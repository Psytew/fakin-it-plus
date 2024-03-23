import React, { useState } from 'react';
import { GameType } from '/models/questions';
import { ACTION_TIMER } from '/models/timer';

interface PerformActionProps {
    category: GameType,
    continueToFakerVoting: () => void,
}

export const PerformAction = (props: PerformActionProps) => {
  const [timer, setTimer] = useState(() => {
    return ACTION_TIMER;
  });

  React.useEffect(() => {
    timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
    if (timer === 0) {
      props.continueToFakerVoting();
    }
  }, [timer]);

  return (
    <div>
      <p>Category: { props.category }</p>
      <p>Go!</p>
      <p className="timer">{ timer }</p>
    </div>
  )
};
