import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

interface typedInterface {
  placeholder?: string;
  onChange: (event: InputEvent) => void;
}

export default function App(props: typedInterface) {
  const [userTypeValue, setUserTypeValue] = React.useState('');

  function handleTypeChange(value:string) {
    setUserTypeValue(value);
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        
        <textarea value={userTypeValue} />
        <textarea value={userTypeValue} onChange={handleTypeChange(value)} />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
