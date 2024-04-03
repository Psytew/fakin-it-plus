import React, { useState } from 'react';
import { Player } from '/models/player';
import { Meteor } from 'meteor/meteor';
import { MIN_PLAYERS } from '/models/constants';
import { TimingConfiguration } from '/models/timingConfiguration';

interface WaitingProps {
    players: Player[],
    player: Player,
    room: string,
    timingConfiguration: TimingConfiguration
}

export const Waiting = (props: WaitingProps) => {
  const [showTimingOptions, setShowTimingOptions] = useState(false);
  
  if (props.player === undefined) {
    return <p>You've been disconnected. Please reload the page.</p>
  }

  function startGame() {
    Meteor.call("game.changeGameState", props.player.room, "Question Voting");
  }

  function removePlayer(id: string) {
    Meteor.call("game.disconnect", id, props.player.room);
  }

  function toggleShowTimingOptions() {
    setShowTimingOptions(!showTimingOptions);
  }

  function setTimingConfiguration(timing: string, value: number) {
    const config = props.timingConfiguration;
    if (timing === "Category Voting Timer") {
      config.categoryVotingTimer = value;
    } else if (timing === "Question Display Timer") {
      config.questionDisplayTimer = value;
    } else if (timing === "Action Timer") {
      config.actionTimer = value;
    } else if (timing === "Faker Voting Timer") {
      config.fakerVotingTimer = value;
    } else if (timing === "Results Timer") {
      config.resultsTimer = value;
    }
    Meteor.call("game.setTimingConfiguration", props.player.room, props.timingConfiguration);
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
    {
      props.player.isHost ?
      <div>
        <hr />
        <div className="flex flex-column">
          <p>
            <button onClick={() => toggleShowTimingOptions()}>Show/Hide Timing Options</button>
          </p>
        </div>
        { showTimingOptions ? 
        <div>
          <p>Timing Options (in seconds)</p>
          <div className="flex flex-column">
            <p>Category Vote</p>
            <select className="select" onChange={(e) => setTimingConfiguration("Category Voting Timer", parseInt(e.target.value))}>
              <option selected={props.timingConfiguration.categoryVotingTimer === 5}>5</option>
              <option selected={props.timingConfiguration.categoryVotingTimer === 10}>10</option>
              <option selected={props.timingConfiguration.categoryVotingTimer === 15}>15</option>
              <option selected={props.timingConfiguration.categoryVotingTimer === 20}>20</option>
              <option selected={props.timingConfiguration.categoryVotingTimer === 25}>25</option>
              <option selected={props.timingConfiguration.categoryVotingTimer === 30}>30</option>
            </select>
          </div>
          <div className="flex flex-column">
            <p>Question Display</p>
            <select className="select" onChange={(e) => setTimingConfiguration("Question Display Timer", parseInt(e.target.value))}>
              <option selected={props.timingConfiguration.questionDisplayTimer === 10}>10</option>
              <option selected={props.timingConfiguration.questionDisplayTimer === 20}>20</option>
              <option selected={props.timingConfiguration.questionDisplayTimer === 30}>30</option>
              <option selected={props.timingConfiguration.questionDisplayTimer === 40}>40</option>
              <option selected={props.timingConfiguration.questionDisplayTimer === 50}>50</option>
              <option selected={props.timingConfiguration.questionDisplayTimer === 60}>60</option>
            </select>
          </div>
          <div className="flex flex-column">
            <p>Action Time</p>
            <select className="select" onChange={(e) => setTimingConfiguration("Action Timer", parseInt(e.target.value))}>
              <option selected={props.timingConfiguration.actionTimer === 5}>5</option>
              <option selected={props.timingConfiguration.actionTimer === 10}>10</option>
              <option selected={props.timingConfiguration.actionTimer === 15}>15</option>
              <option selected={props.timingConfiguration.actionTimer === 20}>20</option>
              <option selected={props.timingConfiguration.actionTimer === 25}>25</option>
              <option selected={props.timingConfiguration.actionTimer === 30}>30</option>
            </select>
          </div>
          <div className="flex flex-column">
            <p>Faker Vote</p>
            <select className="select" onChange={(e) => setTimingConfiguration("Faker Voting Timer", parseInt(e.target.value))}>
              <option selected={props.timingConfiguration.fakerVotingTimer === 30}>30</option>
              <option selected={props.timingConfiguration.fakerVotingTimer === 45}>45</option>
              <option selected={props.timingConfiguration.fakerVotingTimer === 60}>60</option>
              <option selected={props.timingConfiguration.fakerVotingTimer === 90}>90</option>
              <option selected={props.timingConfiguration.fakerVotingTimer === 120}>120</option>
              <option selected={props.timingConfiguration.fakerVotingTimer === 180}>180</option>
            </select>
          </div>
          <div className="flex flex-column">
            <p>Results</p>
            <select className="select" onChange={(e) => setTimingConfiguration("Results Timer", parseInt(e.target.value))}>
              <option selected={props.timingConfiguration.resultsTimer === 5}>5</option>
              <option selected={props.timingConfiguration.resultsTimer === 10}>10</option>
              <option selected={props.timingConfiguration.resultsTimer === 15}>15</option>
              <option selected={props.timingConfiguration.resultsTimer === 20}>20</option>
              <option selected={props.timingConfiguration.resultsTimer === 25}>25</option>
              <option selected={props.timingConfiguration.resultsTimer === 30}>30</option>
            </select>
          </div>
        </div> : '' }
      </div> :
      ''
    }
  </div>
  );
};
