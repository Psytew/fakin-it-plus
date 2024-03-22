import React, { useState } from 'react';
import { Player } from '/models/player';
import { VOTING_TIMER } from '/models/timer';

interface FakerVotingProps {
    players: Player[],
    setFakerVote: React.Dispatch<React.SetStateAction<string>>,
    continueToResults: () => void,
}

export const FakerVoting = (props: FakerVotingProps) => {
    const [timer, setTimer] = useState(VOTING_TIMER);

    function reduceTimer() {
        if (timer === 15) {
            props.setFakerVote(props.players[0].name);
        }
        if (timer === 0) {
            props.continueToResults();
        } else {
            setTimeout(() => {
            setTimer(timer - 1);
            reduceTimer();
            }, 1000)
        }
    }

    // OKAY SO I THINK WHAT'S HAPPENING HERE IS THAT THIS CODE IS CALLED EVERY SINGLE FRAME
    // SO THAT'S WHY THE NUMBERS ARE GLITCHING OUT AND I'M GETTING SOME WEIRD BEHAVIOR WITH STATE
    // NEED TO LOOK INTO REACT HOOKS TO DO THIS IN A MORE CLEAN WAY
    // AND MOVE THE setFakerVote OUT OF THE REDUCETIMER METHOD
    // THIS WORKS FOR NOW THOUGH
    // ALSO THE FIRST GUESS SEEMS MAYBE OFF THIS WAY I DUNNO MAN
    reduceTimer();
    
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
