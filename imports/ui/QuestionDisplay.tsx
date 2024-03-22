import React from 'react';
import { GameType, Question } from '/models/questions';
import { Player } from '/models/player';

interface QuestionDisplayProps {
    category: GameType,
    player: Player,
    isFaker: boolean,
    setQuestion: React.Dispatch<React.SetStateAction<Question>>
}

export const QuestionDisplay = (props: QuestionDisplayProps) => {
  // MAYBE LEARN HOW TO MOVE THIS? THIS WILL NEED TO BE HANDLED BY THE SERVER AT LEAST PARTIALLY
  const questionBank = props.player?.questionBank;
  const question = props.player?.questionBank[props.category]![questionBank[props.category].length - 1]!;
  setTimeout(() => {
    props.setQuestion(question);
  });
  return (
    <div>
      <p>Category: { props.category }</p>
      <p>{ props.isFaker ? question : "You're the faker! Blend in! Lie! Cheat! Do whatever it takes!" }</p>
    </div>
  )
};
