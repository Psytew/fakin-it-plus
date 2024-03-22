import React, { useState } from 'react';
import { ACTION_TIMER } from '/models/timer';

interface ResultsProps {
    correct: boolean,
    continueAfterResults: (correct: boolean) => void
}

export const Results = (props: ResultsProps) => {
  const [timer, setTimer] = useState(ACTION_TIMER);

  function reduceTimer() {
    if (timer === 0) {
      props.continueAfterResults(props.correct);
    } else {
      setTimeout(() => {
        setTimer(timer - 1);
        reduceTimer();
      }, 1000)
    }
  }

  // COMPUTE THE POINTS HERE OR SOMETHING

  reduceTimer();

  if (props.correct) {
    return <><p>You're correct!</p><p className="timer">{ timer }</p></>
  } else {
    return <><p>Nope, not the faker!</p><p className="timer">{ timer }</p></>
  }
};
