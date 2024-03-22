import React, { useState } from 'react';
import { GameType } from '/models/questions';
import { TIMER } from '/models/timer';

interface PerformActionProps {
    category: GameType,
    continueToFakerVoting: () => void,
}

export const PerformAction = (props: PerformActionProps) => {
    const [timer, setTimer] = useState(TIMER);

  function reduceTimer() {
    if (timer === 0) {
      props.continueToFakerVoting();
    } else {
      setTimeout(() => {
        setTimer(timer - 1);
        reduceTimer();
      }, 1000)
    }
  }

  reduceTimer();

  return (
    <div>
      <p>Category: { props.category }</p>
      <p>Do it!</p>
      <p>{ timer }</p>
    </div>
  )
};
