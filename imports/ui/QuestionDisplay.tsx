import React, { useEffect, useState } from 'react';
import { GameType, Question } from '/models/questions';
import { Player } from '/models/player';
import { ACTION_TIMER } from '/models/timer';
import { generateQuestionBank } from '/utils/generateQuestionBank';

interface QuestionDisplayProps {
    category: GameType,
    player: Player,
    isFaker: boolean,
    setQuestion: React.Dispatch<React.SetStateAction<Question>>,
    continueToPerformAction: () => void,
}

export const QuestionDisplay = (props: QuestionDisplayProps) => {
  const [timer, setTimer] = useState(() => {
    return ACTION_TIMER;
  });

  const questionBank = generateQuestionBank();
  const question = questionBank[props.category]![questionBank[props.category].length - 1]!;
  setTimeout(() => {
    props.setQuestion(question);
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
      <p>{ !props.isFaker ? question : "You're the faker! Blend in! Lie! Cheat! Do whatever it takes!" }</p>
      <p className="timer">{ timer }</p>
    </div>
  )
};
