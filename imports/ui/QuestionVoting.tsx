import React, { FormEvent } from 'react';
import { GAME_TYPES, GameType } from '/models/questions';

interface QuestionVotingProps {
    setCategoryVoteInput: React.Dispatch<React.SetStateAction<GameType>>,
    handleCategoryVote: (event: FormEvent<HTMLFormElement>) => void,
}

export const QuestionVoting = (props: QuestionVotingProps) => (
  <div>
    <p>Pick a category</p>
    <select onChange={(e) => {
      // FIGURE THIS OUT OH MY GOD I HATE THIS
      let { name, value } = e.target
        props.setCategoryVoteInput(value as GameType)}
    }>
    {
      GAME_TYPES.filter((gameType) => gameType !== "None").map(gameType => <option key={gameType} value={gameType}>{ gameType }</option>)
    }
    </select>
    <form onSubmit={props.handleCategoryVote}>
      
      <button>Submit</button>
    </form>
  </div>
);
