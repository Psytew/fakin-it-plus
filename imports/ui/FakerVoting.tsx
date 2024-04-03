import React, { useState } from 'react';
import { Player } from '/models/player';
import { Meteor } from 'meteor/meteor';
import { GameType } from '/models/questions';
import { TimingConfiguration } from '/models/timingConfiguration';

interface FakerVotingProps {
    players: Player[],
    player: Player,
    fakerVotes: Record<string, string>,
    round: number,
    category: GameType,
    question: string,
    faker: string,
    timingConfiguration: TimingConfiguration,
    readyVotes: number,
}

export const FakerVoting = (props: FakerVotingProps) => {
    const [timer, setTimer] = useState(() => {
        return props.timingConfiguration.fakerVotingTimer;
    });
    const [ready, setReady] = useState(false);
  
    if (props.player.isHost && props.readyVotes === props.players.length) {
        Meteor.call("game.moveToResults", props.player.room, "Question Voting");
    }

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
  
    function isReady() {
      setReady(true);
      Meteor.call("game.lockInVote", props.player.room);
    }
    
    return (
    <div className="flex flex-column">
        <div className="roundInformation">
            <p>{ props.category }</p>
            <p>-Round { props.round }-</p>
        </div>
        { props.faker === props.player.name ? <p className="mainInstruction">Blend in! Accuse! Cause havoc!</p> : <p className="mainInstruction">Vote for who you think the Faker is!</p> }
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
        <p className="secondaryInstruction">{ props.question }</p>
        <div className="flex flex-column">
            <p>
                <button disabled={ready} onClick={() => isReady()}>{ ready ? "Ready" : "Ready?" }</button>
            </p>
        </div>
    </div>
    )
}
