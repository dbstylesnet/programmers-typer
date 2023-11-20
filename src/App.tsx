import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

const  App = (): JSX.Element => {
  const [userTypeValue, setUserTypeValue] = React.useState('');

  const practiceText = '#include <iostream> int main() {std::cout << "Hello World!"; return 0;}';

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enteredText = event.target.value;
    setUserTypeValue(enteredText);
  }

  return (
    <div className="App">
      <header className="App-header">
          <div className='sub-header'>
            <h2>Programmers typing training</h2>
          </div>  
        <div className="mainTextAreas">
          <div className='inputsArea'>
            <input className='typeInputs userTextInput' placeholder="Start typing here" onChange={handleTypeChange} value={userTypeValue} />
          </div>
          <div className='sub-header'>
            <h3>Practice text:</h3>
          </div>
          <div className="textAreas">
            <textarea className='textInputs topP' value={userTypeValue} />
            <textarea className='textInputs bottomP' value={practiceText}/>
          </div>
        </div>  
      </header>
    </div>
  );
}

export default App;
