import React from 'react';

interface InitialProps {
    moveToNameExisting: () => void,
    moveToNameNew: () => void,
}

export const Initial = (props: InitialProps) => (
  <div>
    <button onClick={props.moveToNameExisting}>Join Game</button>
    <button onClick={props.moveToNameNew}>Create Game</button>
  </div>
);
