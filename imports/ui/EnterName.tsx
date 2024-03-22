import React, { FormEvent } from 'react';

interface EnterNameProps {
    isNewGame: boolean,
    handleNameSubmit: (event: FormEvent<HTMLFormElement>) => void,
    setPlayerName: React.Dispatch<React.SetStateAction<string>>,
    setRoomInput: React.Dispatch<React.SetStateAction<string>>,
}

export const EnterName = (props: EnterNameProps) => (
  <div>
    <p>Enter Name</p>
    <form onSubmit={props.handleNameSubmit}>
      <label>Name</label>
      <input onChange={(e) => props.setPlayerName(e.target.value)} />
      { 
        !props.isNewGame ? <><br /><label>Room Code</label><input onChange={(e) => props.setRoomInput(e.target.value)} /></> : ''
      }
      <button>Submit</button>
    </form>
  </div>
);
