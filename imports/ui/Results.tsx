import React, { useState } from 'react';
import { MAX_ROUNDS_1, MAX_ROUNDS_2, MAX_ROUNDS_CUTOFF, RESULTS_TIMER } from '../../models/constants';
import { Player } from '/models/player';
import { Meteor } from 'meteor/meteor';
import { GameType } from '/models/questions';

interface ResultsProps {
    correct: boolean,
    players: Player[],
    player: Player,
    round: number,
    faker: string,
    category: GameType,
}

export const Results = (props: ResultsProps) => {
  const [timer, setTimer] = useState(() => {
    return RESULTS_TIMER;
  });

  const isOver = props.round >= (props.players.length >= MAX_ROUNDS_CUTOFF ? MAX_ROUNDS_2 : MAX_ROUNDS_1);

  React.useEffect(() => {
    timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
    if (timer === 0) {
        if (props.player.isHost) {
          if (props.correct || isOver) {
            Meteor.call("game.returnToWaitingRoom", props.player.room);
          } else {
            Meteor.call("game.continueWithRound", props.player.room);
          }
        }
    }
}, [timer]);
  if (isOver) {
    return <>
      <p>Category: { props.category }</p>
      <p>Round { props.round }</p>
      <p>Looks like the faker, { props.faker }, won this round!</p>
      <p className="timer">{ timer }</p>
    </>
  }
  if (props.correct && props.player.name !== props.faker) {
    return <>
      <p>Category: { props.category }</p>
      <p>Round { props.round }</p>
      <p>You're correct, the faker was { props.faker } all along!</p>
      <p className="timer">{ timer }</p>
    </>
  } else if (props.correct) {
    return <>
      <p>Category: { props.category }</p>
      <p>Round { props.round }</p>
      <p>Sorry faker, you've been caught!</p>
      <p className="timer">{ timer }</p>
    </>
  } else if (!props.correct && props.player.name !== props.faker) {
    return <>
      <p>Category: { props.category }</p>
      <p>Round { props.round }</p>
      <p>You failed to find the faker! Get ready to try again!</p>
      <p className="timer">{ timer }</p>
    </>
  } else {
    return <>
      <p>Category: { props.category }</p>
      <p>Round { props.round }</p>
      <p>Nice job fakin it! Get ready to do it again!</p>
      <p className="timer">{ timer }</p>
    </>
  }
};
