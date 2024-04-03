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
  const [showRules, setShowRules] = useState(false);

  function toggleShowRules() {
    setShowRules(!showRules);
  }

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
      return 'Make a face like the one described above!';
    } else if (category === 'Hands of Truth') {
      return 'Raise your hand if the statement above is true!';
    } else if (category === 'Impersifacions') {
      return 'Use only your hands and face (no voice) to do the above impersonation!';
    } else if (category === 'Number Pressure') {
      return 'Hold up a number of fingers as described by the prompt above!';
    } else if (category === 'This Much') {
      return 'Hold your hands as far apart as you think the sentence above describes you!';
    } else if (category === 'You Gotta Point') {
      return 'Point at the player you think fits the prompt above best!';
    }
  }

  return (
    <div>
      <div className="roundInformation">
        <p>{ props.category }</p>
        <p>-Round { props.round }-</p>
      </div>
      <p className="mainInstruction">{ props.player.name !== props.faker ? props.question : "You're the faker! Blend in! Lie! Cheat! Do whatever it takes!" }</p>
      <div className="flex flex-column">
          <p>
            <button onClick={() => toggleShowRules()}>Show/Hide Rules</button>
          </p>
        </div>
        { showRules ?
        <p>{ explanation(props.category) }</p> : '' }
      <p className="timer">{ timer }</p>
    </div>
  )
};
