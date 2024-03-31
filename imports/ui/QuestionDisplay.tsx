import React, { useState } from 'react';
import { GameType, Question } from '/models/questions';
import { Player } from '/models/player';
import { Meteor } from 'meteor/meteor';
import { TimingConfiguration } from '/models/timingConfiguration';

interface QuestionDisplayProps {
    category: GameType,
    player: Player,
    faker: string,
    question: Question,
    round: number,
    timingConfiguration: TimingConfiguration,
}

export const QuestionDisplay = (props: QuestionDisplayProps) => {
  const [timer, setTimer] = useState(() => {
    return props.timingConfiguration.questionDisplayTimer;
  });

  React.useEffect(() => {
    timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
    if (timer === 0) {
      if (props.player.isHost) {
        Meteor.call("game.changeGameState", props.player.room, "Perform Action");
      }
    }
  }, [timer]);

  function explanation(category: GameType) {
    if (category === 'Face Value') {
      return 'Make a face like the one described below!';
    } else if (category === 'Hands of Truth') {
      return 'Raise your hand if the statement below is true!';
    } else if (category === 'Impersifacions') {
      return 'Use only your hands and face (no voice) to do the below impersonation!';
    } else if (category === 'Number Pressure') {
      return 'Hold up a number of fingers as described by the prompt below!';
    } else if (category === 'This Much') {
      return 'Hold your hands as far apart as you think the sentence below describes you!';
    } else if (category === 'You Gotta Point') {
      return 'Point at the player you think fits the prompt below best!';
    }
  }

  return (
    <div>
      <p>Category: { props.category }</p>
      <p>Round { props.round }</p>
      <p>{ explanation(props.category) }</p>
      <p>{ props.player.name !== props.faker ? props.question : "You're the faker! Blend in! Lie! Cheat! Do whatever it takes!" }</p>
      <p className="timer">{ timer }</p>
    </div>
  )
};
