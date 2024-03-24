import React, { useState } from 'react';
import { Player } from '/models/player';
import { FAKER_VOTING_TIMER } from '../../models/constants';
import { Meteor } from 'meteor/meteor';

interface FakerVotingProps {
    players: Player[],
    player: Player,
}

export const FakerVoting = (props: FakerVotingProps) => {
    const [timer, setTimer] = useState(() => {
        return FAKER_VOTING_TIMER;
    });

    React.useEffect(() => {
        timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
        if (timer === 0) {
            if (props.player.isHost) {
            Meteor.call("game.moveToQuestionDisplay", props.player.room, "Question Voting");
            }
        }
    }, [timer]);

    function voteOnFaker(faker: string) {
        Meteor.call("game.voteOnFaker", faker, props.player);
    }
    
    return (
    <div className="flex flex-column">
        <p>Vote for who you think the Faker is!</p>
        <select className="select" onChange={(e) => {
        let { value } = e.target
            voteOnFaker(value);
        }}>
        {
        props.players.map(player => <option key={player.name} value={player.name}>{ player.name }</option>)
        }
        </select>
        <p className="timer">{ timer }</p>
    </div>
    )
}
