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
  
  if (props.player === undefined) {
    return <p>You've been disconnected. Please reload the page.</p>
  }

  function startGame() {
    Meteor.call("game.changeGameState", props.player.room, "Question Voting");
  }

  function removePlayer(id: string) {
    Meteor.call("game.disconnect", id, props.player.room);
  }

  return (<div>
    <p>Room Code: { props.room }</p>
    <p>Players</p>
    <ul className="playerList">
    {
        props.players.map(p => 
          <li key={ p.name } > { p.name } ({p.points}) { p.isHost ? '(Host)' : '' }  
            { props.player.isHost && !p.isHost ?
             <span onClick={() => removePlayer(p.userId)}>x</span> :
             ''
            }
          </li>
        )
    }
    </ul>
    <button className="button" disabled={!props.player.isHost || props.players.length < MIN_PLAYERS} onClick={startGame}>Start Game</button>
  </div>);
};
