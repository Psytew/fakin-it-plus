import React, { useState } from 'react';
import { RESULTS_TIMER } from '../../models/constants';

interface ResultsProps {
    correct: boolean,
    continueAfterResults: (correct: boolean) => void
}

export const Results = (props: ResultsProps) => {
  const [timer, setTimer] = useState(() => {
    return RESULTS_TIMER;
  });

  React.useEffect(() => {
    timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
    if (timer === 0) {
      props.continueAfterResults(props.correct);
    }
  }, [timer]);

  if (props.correct) {
    return <><p>You're correct!</p><p className="timer">{ timer }</p></>
  } else {
    return <><p>Nope, not the faker!</p><p className="timer">{ timer }</p></>
  }
};
