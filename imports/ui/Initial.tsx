import React from 'react';

interface InitialProps {
    moveToNameExisting: () => void,
    moveToNameNew: () => void,
}

export const Initial = (props: InitialProps) => (
  <div>
    <button className="button" onClick={props.moveToNameExisting}>Join Game</button>
    <button className="button" onClick={props.moveToNameNew}>Create Game</button>
  </div>
);
