import React, { useState } from 'react';
import { Player } from '/models/player';
import { FAKER_VOTING_TIMER } from '../../models/constants';
import { Meteor } from 'meteor/meteor';
import { GameType } from '/models/questions';

interface FakerVotingProps {
    players: Player[],
    player: Player,
    fakerVotes: Record<string, string>,
    round: number,
    category: GameType,
}

export const FakerVoting = (props: FakerVotingProps) => {
    const [timer, setTimer] = useState(() => {
        return FAKER_VOTING_TIMER;
    });

    React.useEffect(() => {
        timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
        if (timer === 0) {
            if (props.player.isHost) {
                Meteor.call("game.moveToResults", props.player.room, "Question Voting");
            }
        }
    }, [timer]);

    function voteOnFaker(faker: string) {
        Meteor.call("game.voteOnFaker", faker, props.player);
    }

    const currentVotes: Record<string, number> = {};
    for (const p of props.players) {
        currentVotes[p.name] = 0;
    }
    for (const [_key, value] of Object.entries(props.fakerVotes)) {
        if (value in currentVotes) {
            currentVotes[value] = currentVotes[value] + 1;
        }
    }
    
    return (
    <div className="flex flex-column">
        <p>Category: { props.category }</p>
        <p>Round { props.round }</p>
        <p>Vote for who you think the Faker is!</p>
        <select className="select" onChange={(e) => {
        let { value } = e.target
            voteOnFaker(value);
        }}>
        <option key='none' value='none'>????????</option>
        {
        props.players.map(player => <option key={player.name} value={player.name}>{ player.name }</option>)
        }
        </select>
        <p className="timer">{ timer }</p>
        <ul className="playerList">
        {
            Object.entries(currentVotes).map(([key, value]) => <li key={key}> { key } ({value} votes) </li>)
        }
        </ul>
    </div>
    )
}
