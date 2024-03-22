import React from 'react';
import { Player } from '/models/player';

interface WaitingProps {
    players: Player[],
    room: string,
    startGame: () => void,
}

export const Waiting = (props: WaitingProps) => (
  <div>
    <p>Room Code: { props.room }</p>
    <p>Players</p>
    <ul className="playerList">
    {
        props.players.map(player => <li key={player.name}> {player.name } ({player.points})</li>)
    }
    </ul>
    <button className="button" disabled={props.players.length < 3} onClick={props.startGame}>Start Game</button>
  </div>
);
