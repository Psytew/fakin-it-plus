import React from 'react';
import { Player } from '/models/player';

interface FakerVotingProps {
    players: Player[],
    room: string,
    startGame: () => void,
}

export const FakerVoting = (props: FakerVotingProps) => (
  <div>
    <p>Vote for who you think the Faker is!</p>
    <ul>
    {
        props.players.map(player => <li key={player.name}> {player.name }</li>)
    }
    </ul>
    <button disabled={props.players.length < 3} onClick={props.startGame}>Start Game</button>
  </div>
);
