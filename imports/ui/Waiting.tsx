import React from 'react';
import { Player } from '/models/player';
import { Meteor } from 'meteor/meteor';
import { MIN_PLAYERS } from '/models/constants';

interface WaitingProps {
    players: Player[],
    player: Player,
    room: string,
}

export const Waiting = (props: WaitingProps) => {
  function startGame() {
    Meteor.call("game.changeGameState", props.player.room, "Question Voting");
  }

  return (<div>
    <p>Room Code: { props.room }</p>
    <p>Players</p>
    <ul className="playerList">
    {
        props.players.map(player => <li key={player.name}> { player.name } ({player.points}) {player.isHost ? '(Host)' : ''} </li>)
    }
    </ul>
    <button className="button" disabled={!props.player.isHost || props.players.length < MIN_PLAYERS} onClick={startGame}>Start Game</button>
  </div>);
};
