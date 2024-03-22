import React from 'react';
import { Player } from '/models/player';

interface WaitingProps {
    players: Player[]
}

export const Waiting = (props: WaitingProps) => (
  <div>
    <p>Players</p>
    <ul>
    {
        props.players.map(player => <li> {player.name }</li>)
    }
    </ul>
    <button>Start Game</button>
  </div>
);
