import React, { useState } from 'react';
import { GameType, Question } from '/models/questions';
import { Player } from '/models/player';
import { QUESTION_DISPLAY_TIMER } from '../../models/constants';

interface QuestionDisplayProps {
    category: GameType,
    player: Player,
    faker: string,
    question: Question,
    continueToPerformAction: () => void,
}

export const QuestionDisplay = (props: QuestionDisplayProps) => {
  const [timer, setTimer] = useState(() => {
    return QUESTION_DISPLAY_TIMER;
  });

  React.useEffect(() => {
    timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
    if (timer === 0) {
      props.continueToPerformAction();
    }
  }, [timer]);

  return (
    <div>
      <p>Category: { props.category }</p>
      <p>{ props.player.name !== props.faker ? props.question : "You're the faker! Blend in! Lie! Cheat! Do whatever it takes!" }</p>
      <p className="timer">{ timer }</p>
    </div>
  )
};
