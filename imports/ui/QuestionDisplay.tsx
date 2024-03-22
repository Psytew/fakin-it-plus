import React, { useState } from 'react';
import { GameType, Question } from '/models/questions';
import { Player } from '/models/player';
import { TIMER } from '/models/timer';
import { generateQuestionBank } from '/utils/generateQuestionBank';

interface QuestionDisplayProps {
    category: GameType,
    player: Player,
    isFaker: boolean,
    setQuestion: React.Dispatch<React.SetStateAction<Question>>,
    continueToPerformAction: () => void,
}

export const QuestionDisplay = (props: QuestionDisplayProps) => {
  // MAYBE LEARN HOW TO MOVE THIS? THIS WILL NEED TO BE HANDLED BY THE SERVER AT LEAST PARTIALLY
  const questionBank = generateQuestionBank();
  const question = questionBank[props.category]![questionBank[props.category].length - 1]!;
  setTimeout(() => {
    props.setQuestion(question);
  });

  const [timer, setTimer] = useState(TIMER);

  function reduceTimer() {
    if (timer === 0) {
      props.continueToPerformAction();
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
      <p>{ props.isFaker ? question : "You're the faker! Blend in! Lie! Cheat! Do whatever it takes!" }</p>
      <p>{ timer }</p>
    </div>
  )
};
