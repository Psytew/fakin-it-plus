import React, { useState } from 'react';
import { Player } from '/models/player';
import { FAKER_VOTING_TIMER } from '../../models/constants';

interface FakerVotingProps {
    players: Player[],
    setFakerVote: React.Dispatch<React.SetStateAction<string>>,
    continueToResults: () => void,
}

export const FakerVoting = (props: FakerVotingProps) => {
    const [timer, setTimer] = useState(() => {
        return FAKER_VOTING_TIMER;
    });

    React.useEffect(() => {
        props.setFakerVote(props.players[0].name);
    })

    React.useEffect(() => {
      timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
      if (timer === 0) {
        props.continueToResults();
      }
    }, [timer]);
    
    return (
    <div className="flex flex-column">
        <p>Vote for who you think the Faker is!</p>
        <select className="select" onChange={(e) => {
        let { name, value } = e.target
        props.setFakerVote(value)}
        }>
        {
        props.players.map(player => <option key={player.name} value={player.name}>{ player.name }</option>)
        }
        </select>
        <p className="timer">{ timer }</p>
    </div>
    )
}
