import React from 'react';

interface WaitingProps {
    isNewGame: boolean,
    handleNameSubmit: () => void,
}

export const EnterName = (props: WaitingProps) => (
  <div>
    <p>Enter Name</p>
    <form onSubmit={props.handleNameSubmit}>
      <input />
      <button>Submit</button>
    </form>
  </div>
);
